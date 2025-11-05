// api/generate-roster.ts

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
    const { teamName, bowlerCount } = req.body;
    if (!teamName || !bowlerCount) {
      return res.status(400).json({ error: 'Team name and bowler count are required.' });
    }

    const prompt = `Generate ${bowlerCount} realistic names and bowling averages for a men's league bowling team named "${teamName}". The averages should be between 150 and 230. Provide only a valid JSON response based on the required schema. Do not include any other text or markdown formatting.`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            bowlers: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  average: { type: "INTEGER" }
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
    
    res.status(200).setHeader('Content-Type', 'application/json').send(jsonText);

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to generate roster.', details: errorMessage });
  }
}
