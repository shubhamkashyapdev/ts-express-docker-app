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

const router = express.Router()

router.get('/', getAllPosts)
router.get('/:id', getPost)
router.post('/', validate(PostZodSchema), createPost)
router.patch('/:id', updatePost)
router.delete('/:id', deletePost)

export default router
