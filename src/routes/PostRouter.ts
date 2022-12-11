import express from 'express'
import {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} from '@/controller/PostController'
import { protect } from '@/middlewares/authMiddleware'
import { validate, PostZodSchema } from '@/zod-schema'

const router = express.Router()

router.get('/', getAllPosts)
router.get('/:id', getPost)
router.post('/', protect, validate(PostZodSchema), createPost)
router.patch('/:id', protect, updatePost)
router.delete('/:id', protect, deletePost)

export default router
