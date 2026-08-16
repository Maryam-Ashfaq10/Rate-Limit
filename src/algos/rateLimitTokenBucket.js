class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;       // max tokens (burst size)
    this.tokens = capacity;         // start full
    this.refillRate = refillRate;   // tokens added per second
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  tryConsume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  getState() {
    this.refill();
    return { remaining: Math.floor(this.tokens), capacity: this.capacity };
  }
}

// One bucket per client key (IP, API key, etc.)
const buckets = new Map();

function rateLimiterTokenBucket({ capacity = 5, refillRate = 1 } = {}) {
  return (req, res, next) => {
    const key = req.ip; // swap for API key / user id later

    if (!buckets.has(key)) {
      buckets.set(key, new TokenBucket(capacity, refillRate));
    }

    const bucket = buckets.get(key);
    const allowed = bucket.tryConsume(1);
    const state = bucket.getState();
    res.set('X-RateLimit-Limit', capacity);
    res.set('X-RateLimit-Remaining', state.remaining);

    if (!allowed) {
      const retryAfter = Math.ceil(1 / refillRate);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({
        error: 'Too Many Requests',
        retryAfter
      });
    }

    next();
  };
}

module.exports = rateLimiterTokenBucket;