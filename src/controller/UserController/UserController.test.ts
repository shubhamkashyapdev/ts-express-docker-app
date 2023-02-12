import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import * as db from '@/config/test/db'
import createServer from '@/utilities/test-server/testServer'
const app = createServer()
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
})
