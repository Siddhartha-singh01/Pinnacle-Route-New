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

// ── Simple in-memory rate limiter ──────────────────────────

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 12; // 12 requests per minute per IP

const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];
  
  // Prune entries older than the window
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, recent);
    return true;
  }
  
  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

// Periodic cleanup to prevent memory leaks (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requestLog) {
      const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (recent.length === 0) requestLog.delete(ip);
      else requestLog.set(ip, recent);
    }
  }, 5 * 60_000);
}

// ── Allowed language values ────────────────────────────────

const ALLOWED_LANGUAGES = new Set([
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese',
  'Italian', 'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean',
  'Arabic', 'Turkish', 'Indonesian', 'Malay', 'Thai', 'Vietnamese',
  'Bengali', 'Urdu', 'Tamil', 'Telugu', 'Gujarati', 'Marathi',
]);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // ── Rate limiting ────────────────────────────────────
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment before trying again.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }
      });
    }

    // ── Input validation ─────────────────────────────────
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
    }

    const { messages, language } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages must be a non-empty array' }), { status: 400 });
    }
    if (messages.length > 50) {
      return new Response(JSON.stringify({ error: 'Too many messages in conversation' }), { status: 400 });
    }

    // Validate each message
    for (const msg of messages) {
      if (typeof msg !== 'object' || msg === null) {
        return new Response(JSON.stringify({ error: 'Each message must be an object' }), { status: 400 });
      }
      if (typeof msg.role !== 'string' || !['user', 'assistant'].includes(msg.role)) {
        return new Response(JSON.stringify({ error: 'Invalid message role' }), { status: 400 });
      }
      if (typeof msg.content !== 'string' || msg.content.length === 0) {
        return new Response(JSON.stringify({ error: 'Message content must be a non-empty string' }), { status: 400 });
      }
      if (msg.content.length > 5000) {
        return new Response(JSON.stringify({ error: 'Message content exceeds 5000 character limit' }), { status: 400 });
      }
    }

    // Validate language
    const safeLanguage = (typeof language === 'string' && ALLOWED_LANGUAGES.has(language)) ? language : 'English';
    const dynamicInstruction = SYSTEM_INSTRUCTION + `\n\n6. YOU MUST COMMUNICATE WITH THE USER ENTIRELY IN THIS LANGUAGE: ${safeLanguage}.`;

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
    const response = result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: unknown) {

    
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
