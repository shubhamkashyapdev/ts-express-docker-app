import UserModel from '@/models/User'
import asyncHandler from 'express-async-handler'

import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { ErrorResponse } from '@/utilities/errorResponse'

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({}).select('-password')
    res.status(200).json({
        type: 'success',
        data: users
    })
})

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
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
})

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const password = await hashPassword(data.password)
    data.password = password
    const user = await UserModel.create(data)
    req.session.user = user
    res.status(200).json({
        type: 'success',
        data: user
    })
})

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const newUserData = req.body
    if (newUserData?.password) {
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
})

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    await UserModel.findByIdAndRemove(id)
    res.status(200).json({
        type: 'success',
        message: `User with id ${id} deleted successfully`
    })
})

export const login = async (req: Request, res: Response) => {
    const session = req.session
    const { email, password } = req.body
    if (!email || !password) {
        return ErrorResponse(
            res,
            'Invalid parameters, email and password are required',
            400
        )
    }
    const user = await UserModel.findOne({ email: email })
    if (!user) {
        return ErrorResponse(res, 'User not found', 404)
    }
    // compare password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        console.log('error thrown')
        return ErrorResponse(res, `Invalid password provided`, 400)
    } else {
        session.user = user
        res.status(200).json({
            type: 'success'
        })
    }
}

// Utils
const hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}
