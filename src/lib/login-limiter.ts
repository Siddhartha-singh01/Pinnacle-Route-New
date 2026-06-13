/**
 * Shared limiter instance for the admin login form.
 * Lives in its own module so the window survives across requests within a
 * server instance (module scope), independent of the page that imports it.
 * 8 attempts per 15 minutes per IP — humans never hit this; scripts do.
 */
import { createRateLimiter } from "./rate-limit";

export const loginLimiter = createRateLimiter({ windowMs: 15 * 60_000, max: 8 });
