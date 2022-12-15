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

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getUser)
router.post('/', validate(UserZodSchema), createUser)
router.post('/login', login)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
