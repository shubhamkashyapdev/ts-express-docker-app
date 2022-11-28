import mongoose from "mongoose"
import mongoCred from "./config"
export default function connectDB() {
  const mongoSRV = `mongodb://${mongoCred.MONGO_USERNAME}:${mongoCred.MONGO_PASSWORD}@${mongoCred.MONGO_IP_ADDRESS}:${mongoCred.MONGO_PORT}?authSource=admin`

  mongoose
    .connect(mongoSRV)
    .then(() => {
      console.log("Successfully connected to MongoDB")
    })
    .catch((err) => {
      console.log(`MongoDB Connection Failed: ${err.message}`)
    })
}
