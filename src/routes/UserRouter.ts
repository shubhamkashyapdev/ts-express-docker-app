import express from 'express'
import {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    login
} from '@/controller/UserController'
import { validate, UserZodSchema } from '@/schema'
import { protect } from '@/middlewares/authMiddleware'

const router = express.Router()

router.get('/', protect, getAllUsers)
router.post('/login', login)
router.get('/:id', getUser)
router.post('/', validate(UserZodSchema), createUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
