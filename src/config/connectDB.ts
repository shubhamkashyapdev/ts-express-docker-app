import mongoose from 'mongoose'
import logger from '@/utilities/logger'
import config from './config'
const ENV = process.env.NODE_ENV
export function connectDB() {
    const mongoSRV =
        ENV === 'vite'
            ? config.MONGO_URI
            : `mongodb://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@${config.MONGO_IP_ADDRESS}:${config.MONGO_PORT}?authSource=admin`
    logger.info('connecting to mongodb')
    mongoose
        .connect(mongoSRV as string)
        .then(() => {
            logger.info('Successfully connected to MongoDB')
        })
        .catch((err) => {
            logger.info(`MongoDB Connection Failed: ${err.message}`)
        })
}
