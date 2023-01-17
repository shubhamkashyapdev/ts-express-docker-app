import PostModel from '@/models/Post'
import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { redisClient } from '@/utilities'
import { REDIS_PREFIX, REDIS_TTL } from '@/utilities/constants'
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const posts = await PostModel.find({})
    // set in redis
    await redisClient.set(
        REDIS_PREFIX.POST,
        JSON.stringify(posts),
        'EX',
        REDIS_TTL.POST
    )
    res.status(200).json({
        type: 'success',
        data: posts
    })
})
export const getPost = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await PostModel.findById(id)
    if (!post) {
        res.status(404).json({
            type: 'error',
            message: `Post with id ${id} not found!`
        })
    } else {
        // save in redis
        await redisClient.set(
            `${REDIS_PREFIX.POST}:${id}`,
            JSON.stringify(post),
            'EX',
            REDIS_TTL.POST
        )
        res.status(200).json({
            success: true,
            status: 'OK',
            data: post
        })
    }
})

export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const postData = req.body

    const post = await PostModel.create(postData)
    // @TODO: emit socket event when a post is created
    // io.emit('new-post')

    // save post in redis cache
    await redisClient.set(
        `${REDIS_PREFIX.POST}:${post.id}`,
        JSON.stringify(post),
        'EX',
        REDIS_TTL.POST
    )

    // invalidate the redis cache
    await redisClient.expire(REDIS_PREFIX.POST, 1)

    res.status(200).json({
        type: 'success',
        data: post
    })
})

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const newPostData = req.body
    const newPost = await PostModel.findByIdAndUpdate(id, newPostData, {
        runValidators: true,
        new: true
    })
    // invalidate the redis cache - @todo - expire cache immediately
    await redisClient.expire(REDIS_PREFIX.POST, 1)
    await redisClient.set(
        `${REDIS_PREFIX.POST}:${id}`,
        JSON.stringify(newPost),
        'EX',
        REDIS_TTL.POST
    )
    res.status(200).json({
        type: 'success',
        data: newPost
    })
})

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    await PostModel.findByIdAndRemove(id)
    // invalidate the redis cache - @todo - expire cache immediately
    await redisClient.expire(REDIS_PREFIX.POST, 1)
    await redisClient.expire(`${REDIS_PREFIX.POST}:${id}`, 1)
    res.status(200).json({
        type: 'success',
        message: `Post with id ${id} deleted successfully`
    })
})
