import app from '@/server/server'
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import * as db from '@/config/test/db'

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

    it('API should be up and running', async () => {
        const res = await request(app).get('/api/v1/health-check')
        expect(res.body.success).toBe(true)
    })
})
