/**
 * Admin authentication
 * ---------------------
 * Stateless, signed-cookie sessions. The cookie value is an HMAC-signed token
 * (`payload.signature`) — it cannot be forged without SESSION_SECRET, which
 * fixes the previous "admin_session=authenticated" bypass.
 *
 * Secrets come from the environment (never committed):
 *   ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET
 * `process.env` (runtime host vars) takes precedence over build-time `.env`.
 */
import crypto from "node:crypto";

// The standalone Node server does not auto-load .env. Pull it into process.env
// at runtime (no-op if absent — production hosts set real env vars instead).
if (typeof process !== "undefined" && !process.env.SESSION_SECRET) {
  try {
    (process as NodeJS.Process & { loadEnvFile?: (p?: string) => void }).loadEnvFile?.();
  } catch {
    /* .env not present (e.g. production host) — use existing process.env */
  }
}

const env = (key: string): string | undefined =>
  process.env[key] ?? (import.meta.env as Record<string, string | undefined>)[key];

const ADMIN_EMAIL = env("ADMIN_EMAIL") ?? "";
const ADMIN_PASSWORD = env("ADMIN_PASSWORD") ?? "";
// Last-resort random secret keeps tokens unforgeable even if SESSION_SECRET is
// unset (sessions simply reset on restart). Always set SESSION_SECRET in prod.
const SESSION_SECRET = env("SESSION_SECRET") ?? crypto.randomBytes(32).toString("hex");

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 1 week

export const SESSION_COOKIE = "admin_session";

interface SessionPayload {
  email: string;
  exp: number;
}

/** Constant-time string comparison (avoids credential timing leaks). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

/** Validate submitted admin credentials against the configured env values. */
export function verifyCredentials(email: unknown, password: unknown): boolean {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return false;
  if (typeof email !== "string" || typeof password !== "string") return false;
  // Evaluate both to keep timing uniform.
  const emailOk = safeEqual(email, ADMIN_EMAIL);
  const passwordOk = safeEqual(password, ADMIN_PASSWORD);
  return emailOk && passwordOk;
}

/** Create a signed session token for the given admin email. */
export function createSessionToken(email: string): string {
  const payloadJson = JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS } satisfies SessionPayload);
  const payload = Buffer.from(payloadJson, "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Verify a session token. Returns the payload if valid & unexpired, else null. */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
    if (typeof data.email !== "string") return null;
    return data;
  } catch {
    return null;
  }
}
