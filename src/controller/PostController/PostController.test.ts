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
        // login
        const user = await request(app).post('/api/v1/user').send({
            name: 'dev1',
            email: 'dev1@gmail.com',
            password: '12345678',
            confirmPassword: '12345678'
        })
        expect(user.body.success).toBe(true)
        const token = user.body.token
        const postUnauthorized = await request(app).post('/api/v1/post').send({
            title: 'Test Post',
            body: 'Test Post Body'
        })
        // Should failed if user iser not logged in
        expect(postUnauthorized.statusCode).toBe(401)
        const post = await request(app)
            .post('/api/v1/post')
            .send({
                title: 'Test Post',
                body: 'Test Post Body'
            })
            .set('Authorization', `Bearer ${token}`)
        expect(post.body.success).toBe(true)
        expect(post.body.data.title).toBe('Test Post')
        const posts = await request(app).get('/api/v1/post')
        let data = posts.body.data
        if (typeof data === typeof '') {
            data = JSON.parse(posts.body.data)
        }
        expect(data.length).toBe(1)
    })
    it('Should update the post', async () => {
        const user = await request(app).post('/api/v1/user').send({
            name: 'dev1',
            email: 'dev1@gmail.com',
            password: '12345678',
            confirmPassword: '12345678'
        })
        expect(user.body.success).toBe(true)
        const token = user.body.token
        // create the post
        const post = await request(app)
            .post('/api/v1/post')
            .send({
                title: 'Test Post',
                body: 'Test Post Body'
            })
            .set('Authorization', 'Bearer ' + token)
        // update the post
        const updatedPost = await request(app)
            .patch(`/api/v1/post/${post.body.data._id}`)
            .send({
                title: 'Updated Post',
                body: 'Updated Post Body'
            })
            .set('Authorization', 'Bearer ' + token)
        expect(updatedPost.body.data.title).toBe('Updated Post')
    })
    it('Should delete the post', async () => {
        const user = await request(app).post('/api/v1/user').send({
            name: 'dev1',
            email: 'dev1@gmail.com',
            password: '12345678',
            confirmPassword: '12345678'
        })
        expect(user.body.success).toBe(true)
        const token = user.body.token
        // create the post
        const post = await request(app)
            .post('/api/v1/post')
            .send({
                title: 'Test Post',
                body: 'Test Post Body'
            })
            .set('Authorization', 'Bearer ' + token)
        const id = post.body.data._id

        // delete the post
        const deletedPost = await request(app)
            .delete(`/api/v1/post/${id}`)
            .set('Authorization', 'Bearer ' + token)
        expect(deletedPost.statusCode).toBe(200)
    })
})
