import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import * as db from '@/config/test/db'
import app from '@/server/server'
import request from 'supertest'

describe('Testing Post API', () => {
    beforeAll(async () => {
        await db.connect()
    })
    afterEach(async () => {
        await db.clearDatabase()
    })
    afterAll(async () => {
        await db.closeDatabase()
    })
    it('Should return a status of 200 OK', async () => {
        const res = await request(app).get('/api/v1/post')
        expect(res.statusCode).toBe(200)
    })
    it('Should successfully return all post on / route', async () => {
        const res = await request(app).get('/api/v1/post')
        expect(res.body.success).toBe(true)
    })
    it('Should create a new post and post collection should have 1 post in database', async () => {
        const post = await request(app).post('/api/v1/post').send({
            title: 'Test Post',
            body: 'Test Post Body'
        })
        // Should failed if user iser not logged in
        expect(post.statusCode).toBe(401)

        // expect(post.body.success).toBe(true)
        // expect(post.body.data.title).toBe('Test Post')
        // const posts = await request(app).get('/api/v1/post')
        // expect(posts.body.data.length).toBe(1)
    })
    it('Should update the post', async () => {
        // create the post
        const post = await request(app).post('/api/v1/post').send({
            title: 'Test Post',
            body: 'Test Post Body'
        })
        // update the post
        const updatedPost = await request(app)
            .patch(`/api/v1/post/${post.body.data._id}`)
            .send({
                title: 'Updated Post',
                body: 'Updated Post Body'
            })
        expect(updatedPost.body.data.title).toBe('Updated Post')
    })
    it('Should delete the post', async () => {
        // create the post
        const post = await request(app).post('/api/v1/post').send({
            title: 'Test Post',
            body: 'Test Post Body'
        })
        const id = post.body.data._id
        // delete the post
        const deletedPost = await request(app).delete(`/api/v1/post/${id}`)
        expect(deletedPost.statusCode).toBe(200)
    })
})
