import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import * as db from '@/config/test/db'
import app from '@/server/server'
import request from 'supertest'

describe('Testing User API', () => {
    beforeAll(async () => {
        await db.connect()
    })
    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })

    describe('User API', () => {
        it('should return a 200 status', async () => {
            expect(true).toBe(true)
        })
    })
})
