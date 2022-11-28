export default {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_IP_ADDRESS: process.env.MONGO_IP_ADDRESS || "database",
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  REDIS_URL: process.env.REDIS_URL || "redis",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SESSION_SECRET: process.env.SESSION_SECRET,
}
