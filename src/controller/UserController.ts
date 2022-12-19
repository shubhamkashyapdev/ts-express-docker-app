import UserModel from '@/models/User'
import { handleError } from '@/utilities/Error'
import logger from '@/utilities/logger'

import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await UserModel.find({}).select('-password')
    res.status(200).json({
        type: 'success',
        data: users
    })
}
export const getUser = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const user = await UserModel.findById(id).select('-password')
        if (!user) {
            res.status(404).json({
                type: 'error',
                message: `User with id ${id} not found!`
            })
            return
        }
        res.status(200).json({
            type: 'success',
            data: user
        })
    } catch (err: unknown) {
        handleError(res, err)
    }
}

export const createUser = async (req: Request, res: Response) => {
    const data = req.body
    const password = await hashPassword(data.password)
    data.password = password
    try {
        const user = await UserModel.create(data)

        req.session.user = user

        res.status(200).json({
            type: 'success',
            data: user
        })
    } catch (err) {
        handleError(res, err)
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id
    const newUserData = req.body
    try {
        if (newUserData.password) {
            res.status(400).json({
                type: 'error',
                message: `Password cannot be changed`
            })
        }
        const newUser = await UserModel.findByIdAndUpdate(id, newUserData, {
            runValidators: true,
            new: true
        })
        res.status(200).json({
            type: 'success',
            data: newUser
        })
    } catch (err: unknown) {
        handleError(res, err)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        await UserModel.findByIdAndRemove(id)
        res.status(200).json({
            type: 'success',
            message: `User with id ${id} deleted successfully`
        })
    } catch (err: unknown) {
        handleError(res, err)
    }
}

export const login = async (req: Request, res: Response) => {
    const session = req.session
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({
            success: 'error',
            message: 'Invalid parameters, email and password are required'
        })
    }
    try {
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                type: 'error',
                message: `User Not Found`
            })
        }
        // compare password
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            res.status(400).json({
                type: 'error',
                message: `Invalid Password`
            })
        }

        session.user = user

        logger.info({ session })
        res.status(200).json({
            type: 'success'
        })
    } catch (err: unknown) {
        handleError(res, err)
    }
}

// Utils
const hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}
