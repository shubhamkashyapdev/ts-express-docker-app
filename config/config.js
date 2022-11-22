module.exports = {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_IP_ADDRESS: process.env.MONGO_IP_ADDRESS || "database",
  MONGO_PORT: process.env.MONGO_PORT || 27017,
}
