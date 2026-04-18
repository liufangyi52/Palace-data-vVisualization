import config from "../config/index.js";

const requests = new Map();

export const rateLimit = (req, res, next) => {
  const key = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  if (!requests.has(key)) {
    requests.set(key, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const record = requests.get(key);

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return next();
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader("Retry-After", retryAfter);
    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", 0);
    res.setHeader("X-RateLimit-Reset", record.resetTime);

    return res.status(429).json({
      code: 429,
      message: "请求过于频繁，请稍后再试",
      error: "TOO_MANY_REQUESTS",
      retryAfter,
    });
  }

  record.count++;
  res.setHeader("X-RateLimit-Limit", maxRequests);
  res.setHeader("X-RateLimit-Remaining", maxRequests - record.count);
  res.setHeader("X-RateLimit-Reset", record.resetTime);

  next();
};

export const ipWhitelist = (whitelist = []) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    if (whitelist.length === 0 || whitelist.includes(ip)) {
      return next();
    }

    res.status(403).json({
      code: 403,
      message: "IP禁止访问",
      error: "IP_FORBIDDEN",
    });
  };
};

export const clearRateLimit = (key) => {
  if (key) {
    requests.delete(key);
  } else {
    requests.clear();
  }
};

export const getRateLimitInfo = (ip) => {
  const record = requests.get(ip);
  if (!record) return null;

  return {
    count: record.count,
    remaining: config.rateLimit.maxRequests - record.count,
    resetTime: record.resetTime,
  };
};

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requests.entries()) {
    if (now > record.resetTime) {
      requests.delete(key);
    }
  }
}, 60000);

export default {
  rateLimit,
  ipWhitelist,
  clearRateLimit,
  getRateLimitInfo,
};
