export const prerender = false;

import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for Pinnacle Route, a premium digital studio. 
Your primary and ONLY goal is to assist visitors, answer questions about our website, and provide details related to custom software, software development, AI solutions, UI/UX design, and digital strategy.

CRITICAL RULES (STRICTLY ENFORCED):
1. ABSOLUTELY NO OUT-OF-SCOPE TOPICS: You must strictly restrict your answers to Pinnacle Route, our website, and our custom software services. 
2. If a user asks ANYTHING outside of this window (e.g., general knowledge, coding help, recipes, politics, weather, history, other companies), you MUST refuse to answer. Reply exactly with: "I'm sorry, but I can only answer questions regarding Pinnacle Route and our custom software services."
3. Keep your responses concise, professional, and maintain a premium, expert tone.
4. If a user seems interested in starting a project, provide a link to our Strategy Call page: [Book a Strategy Call](/strategy-call).
5. Do not make up prices or timelines. We build custom software and AI solutions; timelines and budgets are discussed during the strategy call.
`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages, language } = await request.json();

    const dynamicInstruction = SYSTEM_INSTRUCTION + `\n\n6. YOU MUST COMMUNICATE WITH THE USER ENTIRELY IN THIS LANGUAGE: ${language || 'English'}.`;

    if (!import.meta.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Gemini API key is not configured." }), { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: dynamicInstruction,
    });

    // Format history for Gemini API
    // Gemini expects { role: 'user' | 'model', parts: [{text: string}] }
    let formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Google Gemini API strictly requires that the history starts with a 'user' message.
    // If the first message is the assistant's greeting, we must drop it from the API history array.
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {

    
    // Instead of showing a generic error to the user when Google blocks the API key (403),
    // we provide a graceful fallback response so the Chatbot UI continues to function perfectly.
    const fallbackResponse = "Hello! I am currently operating in a simplified mode. While I cannot answer complex queries right now, I highly recommend booking a [Strategy Call](/strategy-call) with our team so we can discuss your custom software needs directly!";
    
    return new Response(JSON.stringify({ response: fallbackResponse }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
