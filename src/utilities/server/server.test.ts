import app from './server'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import * as mongoose from 'mongoose'

describe('Testing Post Controller', async () => {
    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        console.log(uri.slice(0, uri.lastIndexOf('/')))
        await mongoose.connect(uri.slice(0, uri.lastIndexOf('/')))
    })
    afterAll(async () => {
        // The Server can be stopped again with
    })
    it('Should return all post on / route', async () => {
        const res = await request(app).get('/api/v1')
        expect(res.statusCode).toBe(200)
    })
})
