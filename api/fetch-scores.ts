// api/fetch-scores.ts

// Add this line at the top to fix the 'process' error
declare const process: any;

// Change this line to use a full URL, so the server knows where to find the code
import { GoogleGenAI, Type } from "https://esm.sh/@google/genai";

// This is a placeholder for a function that fetches the raw HTML.
// In a real environment (like Node.js), you'd use a library like 'node-fetch' or 'axios'.
async function fetchWebsiteContent(url: string): Promise<string> {
  // In a real server environment, this would make an actual HTTP request.
  // For now, it returns a message indicating its purpose.
  // To make this functional, you would replace this with a real fetch implementation.
  console.log(`Pretending to fetch HTML content from: ${url}`);
  // You would need a library like 'node-fetch' here in a Node.js environment.
  // const response = await fetch(url);
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch website: ${response.statusText}`);
  // }
  // return await response.text();
  return "<html>... a lot of html from lanetalk.com ...</html>";
}

// The main function for the serverless environment
export async function handler() {
  const LANE_TALK_URL = 'https://www.lanetalk.com/leagues/top-dawg-classic/scores';
  const aistudio_api_key = process.env.API_KEY;

  if (!aistudio_api_key) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Step 1: Fetch the raw HTML from the website.
    // NOTE: This part requires a real server environment to work.
    const rawHtml = await fetchWebsiteContent(LANE_TALK_URL);

    // Step 2: Send the HTML to Gemini for parsing.
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
    
    // Step 3: Return the clean JSON to the frontend app.
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
