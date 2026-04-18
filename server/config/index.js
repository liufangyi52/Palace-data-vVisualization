const config = {
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "palace-vista-secret-key-2024",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },
  cache: {
    enabled: process.env.CACHE_ENABLED === "true",
    ttl: parseInt(process.env.CACHE_TTL) || 300,
  },
  data: {
    palacesPath: process.env.DATA_PALACES_PATH || "./data/palaces.json",
    databasePath: process.env.DATA_DATABASE_PATH || "./data/database.json",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
};

export default config;
