/**
 * In-memory sliding-window rate limiter
 * -------------------------------------
 * Shared by the public endpoints (contact form, chat, admin login).
 * Per-instance only: on serverless each warm instance keeps its own window,
 * which still blunts brute force and form spam without external state.
 */

interface LimiterOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Max hits allowed per key inside the window. */
  max: number;
}

const CLEANUP_INTERVAL_MS = 5 * 60_000;

export function createRateLimiter({ windowMs, max }: LimiterOptions) {
  const log = new Map<string, number[]>();

  // Periodically drop empty keys so long-lived instances don't leak memory.
  if (typeof setInterval !== "undefined") {
    const timer = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of log) {
        const recent = timestamps.filter((t) => now - t < windowMs);
        if (recent.length === 0) log.delete(key);
        else log.set(key, recent);
      }
    }, CLEANUP_INTERVAL_MS);
    // Don't keep the process alive just for cleanup.
    (timer as unknown as { unref?: () => void }).unref?.();
  }

  return {
    /** Records a hit and returns true when the key is over its limit. */
    isLimited(key: string): boolean {
      const now = Date.now();
      const recent = (log.get(key) || []).filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        log.set(key, recent);
        return true;
      }
      recent.push(now);
      log.set(key, recent);
      return false;
    },
  };
}

/** Escape HTML special characters so user input can be embedded in HTML emails. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
