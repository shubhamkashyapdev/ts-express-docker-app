import express from 'express'
import {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} from '@/controller/PostController/PostController'
import { protect } from '@/middlewares/authMiddleware'
import { validate, PostZodSchema } from '@/schema'
import { redisById, redisStatic } from '@/middlewares/redis'
import { REDIS_PREFIX } from '@/utilities/constants'

const router = express.Router()

router.get('/', redisStatic(REDIS_PREFIX.POST), getAllPosts)
router.get('/:id', redisById(REDIS_PREFIX.POST), getPost)
router.post('/', protect, validate(PostZodSchema), createPost)
router.patch('/:id', protect, updatePost)
router.delete('/:id', protect, deletePost)

export default router
