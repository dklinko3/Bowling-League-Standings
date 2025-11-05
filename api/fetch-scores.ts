// api/fetch-scores.ts

// THIS IS THE FIX: Tell Vercel to run this on the Edge, which supports URL imports
export const config = {
  runtime: 'edge',
};

// Import the library from a URL, which the Edge runtime understands
import { GoogleGenAI, Type } from "https://esm.sh/@google/genai";

// This is a placeholder for a function that fetches the raw HTML.
async function fetchWebsiteContent(url: string): Promise<string> {
  console.log(`Pretending to fetch HTML content from: ${url}`);
  // In a real server environment, this would be replaced with a library like node-fetch
  return "<html>... a lot of html from lanetalk.com ...</html>";
}

// The main function, updated for the Edge runtime
export default async function handler(request: Request) {
  const LANE_TALK_URL = 'https://www.lanetalk.com/leagues/top-dawg-classic/scores';
  // Vercel makes environment variables available on process.env in Edge functions
  const aistudio_api_key = process.env.API_KEY;

  if (!aistudio_api_key) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const rawHtml = await fetchWebsiteContent(LANE_TALK_URL);

    const ai = new GoogleGenAI({ apiKey: aistudio_api_key });
    const prompt = `
      From the following raw HTML content from a bowling website, extract the scores for the "Top Dawg Classic" league for the most recent date available.
      Identify each team and the bowlers on that team. For each bowler, provide their three game scores.
      Some bowlers might be absent; their scores should be [0, 0, 0].
      Provide only a valid JSON response based on the required schema. Do not include any other text or markdown formatting.

      HTML Content:
      ${rawHtml}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    teamScores: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                teamName: { type: Type.STRING },
                                bowlerScores: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            bowlerName: { type: Type.STRING },
                                            scores: { type: Type.ARRAY, items: { type: Type.INTEGER } }
                                        },
                                    }
                                }
                            },
                        }
                    }
                },
            }
        }
    });
    
    return new Response(response.text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to process scores.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
