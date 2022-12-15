export default {
    MONGO_USERNAME: process.env.MONGO_USERNAME,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_IP_ADDRESS: process.env.MONGO_IP_ADDRESS,
    MONGO_IP_ADDRESS_JEST: process.env.MONGO_IP_ADDRESS,
    MONGO_PORT: process.env.MONGO_PORT,
    REDIS_URL: process.env.REDIS_URL || 'redis',
    REDIS_URL_JEST: process.env.REDIS_URL || 'redis-jest',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    REDIS_URI: process.env.REDIS_URI
}
