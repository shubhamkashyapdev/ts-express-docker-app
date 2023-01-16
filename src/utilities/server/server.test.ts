import createServer from './testServer'
const app = createServer()
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import * as db from '@/config/db'

describe('Testing Post Controller', async () => {
    beforeAll(async () => {
        await db.connect()
    })
    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })

    it('Helth Check', async () => {
        const res = await request(app).get('/api/v1')
        expect(res.statusCode).toBe(200)
    })
})
