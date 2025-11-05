// api/fetch-scores.ts

// The main handler for the serverless function.
// Vercel automatically passes request (req) and response (res) objects.
export default async function handler(req: any, res: any) {
  
  // THE FIX: Access environment variables without using 'process', which solves the build error.
  const { API_KEY } = (globalThis as any).process.env;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // A placeholder for fetching the real website content.
  const rawHtml = "<html>... a lot of html from lanetalk.com ...</html>";

  const prompt = `
    From the following raw HTML content from a bowling website, extract the scores for the "Top Dawg Classic" league for the most recent date available.
    Identify each team and the bowlers on that team. For each bowler, provide their three game scores.
    Some bowlers might be absent; their scores should be [0, 0, 0].
    Provide only a valid JSON response based on the required schema. Do not include any other text or markdown formatting.

    HTML Content:
    ${rawHtml}
  `;

  const requestBody = {
    contents: [{
      parts: [{ text: prompt }]
    }],
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
                teamName: { type: "STRING" },
                bowlerScores: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      bowlerName: { type: "STRING" },
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

  try {
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("API Error:", errorText);
      throw new Error(`Google AI API request failed with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    
    const jsonText = responseData.candidates[0].content.parts[0].text;

    res.status(200).setHeader('Content-Type', 'application/json').send(jsonText);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process scores.' });
  }
}
