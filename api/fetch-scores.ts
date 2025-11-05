// api/fetch-scores.ts

// The main handler for the serverless function.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { API_KEY } = (globalThis as any).process.env;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { scheduledMatchups, teams, week } = req.body;
    if (!scheduledMatchups || !teams || !week) {
      return res.status(400).json({ error: 'Week, scheduled matchups, and team rosters are required.' });
    }

    const rawHtml = "<html>... a lot of html from lanetalk.com ...</html>";

    const prompt = `
      Based on the provided raw HTML from a bowling website and the league's schedule for this week, generate realistic scores for every bowler.
      - The event is the "Top Dawg Classic" league for week ${week}.
      - Use the provided team rosters and matchups to structure your response.
      - Scores for each game should be realistic for the bowler's book average, generally within +/- 20 pins, but with occasional great or poor games.
      - Some bowlers might be absent; if so, their scores should be [0, 0, 0].
      - Provide ONLY a valid JSON response based on the required schema. Do not include any other text or markdown formatting.

      SCHEDULED MATCHUPS: ${JSON.stringify(scheduledMatchups)}
      TEAMS: ${JSON.stringify(teams.map((t: any) => ({id: t.id, name: t.name, bowlers: t.bowlers.map((b: any) => ({id: b.id, name: b.name, average: b.average}))})))}
      WEBSITE HTML: ${rawHtml}
    `;
    
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            teamScores: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  teamId: { type: "INTEGER" },
                  bowlerScores: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        bowlerId: { type: "INTEGER" },
                        scores: { type: "ARRAY", items: { type: "INTEGER" } }
                      },
                    }
                  }
                },
              }
            }
          },
        }
      }
    };

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Google AI API request failed: ${errorText}`);
    }

    const responseData = await apiResponse.json();
    const jsonText = responseData.candidates[0].content.parts[0].text;
    
    // We need to add the week back in, as the schema can't enforce it
    const parsedJson = JSON.parse(jsonText);
    const finalResponse = {
        week: week,
        ...parsedJson
    };

    res.status(200).setHeader('Content-Type', 'application/json').send(JSON.stringify(finalResponse));

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to fetch scores.', details: errorMessage });
  }
}
