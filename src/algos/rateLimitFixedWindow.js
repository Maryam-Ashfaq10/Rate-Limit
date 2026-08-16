
class FixedWindowRateLimiter {
  /**
   * @param {Object} options
   * @param {number} options.windowMs - size of each fixed window in ms
   * @param {number} options.maxRequests - max requests allowed per window
   * @param {Function} [options.keyGenerator] - function(req) => string, defaults to IP
   */
  constructor({ windowMs, maxRequests, keyGenerator }) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.keyGenerator = keyGenerator || ((req) => req.ip);

    // Map<key, { windowStart: number, count: number }>
    this.store = new Map();

    // periodic cleanup so the store doesn't grow unbounded with stale keys
    this.cleanupInterval = setInterval(() => this._cleanup(), this.windowMs);
    // don't keep the process alive just for cleanup
    if (this.cleanupInterval.unref) this.cleanupInterval.unref();
  }

  _cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.windowStart >= this.windowMs) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Core check. Returns info about whether the request is allowed,
   * plus metadata useful for setting response headers.
   */
  check(key) {
    const now = Date.now();
    let entry = this.store.get(key);

    // No entry yet, or the current window has expired -> start a new window
    if (!entry || now - entry.windowStart >= this.windowMs) {
      entry = { windowStart: now, count: 0 };
      this.store.set(key, entry);
    }

    entry.count += 1;

    const allowed = entry.count <= this.maxRequests;
    const remaining = Math.max(0, this.maxRequests - entry.count);
    const resetTime = entry.windowStart + this.windowMs;

    return { allowed, remaining, resetTime, limit: this.maxRequests };
  }

  /**
   * Express middleware factory
   */
  middleware() {
    return (req, res, next) => {
      const key = this.keyGenerator(req);
      const { allowed, remaining, resetTime, limit } = this.check(key);

      const resetInSeconds = Math.ceil((resetTime - Date.now()) / 1000);

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetInSeconds);

      if (!allowed) {
        res.setHeader('Retry-After', resetInSeconds);
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${resetInSeconds}s.`,
        });
      }

      next();
    };
  }

  // Optional: stop the cleanup timer (useful in tests)
  stop() {
    clearInterval(this.cleanupInterval);
  }
}

module.exports = FixedWindowRateLimiter;