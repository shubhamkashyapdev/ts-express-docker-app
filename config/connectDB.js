const mongoose = require("mongoose")
const mongoCred = require("./config")
function connectDB() {
  const mongoSRV = `mongodb://${mongoCred.MONGO_USERNAME}:${mongoCred.MONGO_PASSWORD}@${mongoCred.MONGO_IP_ADDRESS}:${mongoCred.MONGO_PORT}?authSource=admin`

  mongoose
    .connect(mongoSRV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB")
    })
    .catch((err) => {
      console.log(`MongoDB Connection Failed: ${err.message}`)
    })
}

module.exports = connectDB
