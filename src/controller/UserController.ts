import UserModel from "@/models/User"
import bcrypt from "bcryptjs"
import { Request, Response } from "express"
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find({}).select("-password")
  res.status(200).json({
    type: "success",
    data: users,
  })
}
export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const user = await UserModel.findById(id).select("-password")
    if (!user) {
      res.status(404).json({
        type: "error",
        message: `User with id ${id} not found!`,
      })
      return
    }
    res.status(200).json({
      type: "success",
      data: user,
    })
  } catch (err: any) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}

export const createUser = async (req: Request, res: Response) => {
  const data = req.body
  const userData = await hashPassword(data)
  try {
    const user = await UserModel.create(userData)
    // @ts-ignore
    req.session.user = user
    res.status(200).json({
      type: "success",
      data: user,
    })
  } catch (err: any) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id
  const newUserData = req.body
  try {
    if (newUserData.password) {
      res.status(400).json({
        type: "error",
        message: `Password cannot be changed`,
      })
    }
    const newUser = await UserModel.findByIdAndUpdate(id, newUserData, {
      runValidators: true,
      new: true,
    })
    res.status(200).json({
      type: "success",
      data: newUser,
    })
  } catch (err: any) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    await UserModel.findByIdAndRemove(id)
    res.status(200).json({
      type: "success",
      message: `User with id ${id} deleted successfully`,
    })
  } catch (err: any) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}

export const login = async (req: Request, res: Response) => {
  const session = req.session
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({
      success: "error",
      message: "Invalid parameters, email and password are required",
    })
  }
  try {
    const user = await UserModel.findOne({ email: email })
    if (!user) {
      return res.status(404).json({
        type: "error",
        message: `User Not Found`,
      })
    }
    // compare password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      res.status(400).json({
        type: "error",
        message: `Invalid Password`,
      })
    }
    // @ts-ignore
    session.user = user
    res.status(200).json({
      type: "success",
    })
  } catch (err: any) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}

// Utils
const hashPassword = async (data: any) => {
  const password = await bcrypt.hash(data.password, 10)
  data.password = password
  return data
}
