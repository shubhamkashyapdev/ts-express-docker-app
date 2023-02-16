/* eslint-disable no-loops/no-loops */
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
const mongod = MongoMemoryServer.create()
export const connect = async () => {
    const uri = await (await mongod).getUri()
    try {
        await mongoose.connect(uri)
    } catch (err) {
        console.log({ err })
    }
}
export const closeDatabase = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await (await mongod).stop()
}
export const clearDatabase = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany({})
    }
}
