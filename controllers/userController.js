import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from 'joi'

import {
  userSchema,
  updatePasswordSchema,
  updateUserSchema,
  recoveryEmailSchema,
} from '../schemas/userSchemas.js'

// signup
export const signUp = async (req, res) => {
  const { error } = userSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      recoveryEmail,
      DOB,
      mobileNumber,
      role,
    })

    const savedUser = await newUser.save()
    res.status(201).json({
      message: 'User created successfully',
      user: savedUser,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// signIn
export const signIn = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({
      $or: [{ email }, { recoveryEmail: email }, { mobileNumber: email }],
    })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )
    user.status = 'online'

    await user.save()

    res.json({
      message: 'User signed in successfully',
      token,
      user,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// updateAccount
export const updateAccount = async (req, res) => {
  const { error } = updateUserSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const userId = req.user.id
  const updates = req.body

  try {
    // Check for email conflict
    if (updates.email) {
      const emailConflict = await User.findOne({ email: updates.email })
      if (emailConflict && emailConflict._id.toString() !== userId) {
        return res.status(400).json({ error: 'Email already in use' })
      }
    }

    // Check for mobile number conflict
    if (updates.mobileNumber) {
      const mobileConflict = await User.findOne({
        mobileNumber: updates.mobileNumber,
      })
      if (mobileConflict && mobileConflict._id.toString() !== userId) {
        return res.status(400).json({ error: 'Mobile number already in use' })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    })
    res.json({
      message: 'Account updated successfully',
      user: updatedUser,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// deleteAccount
export const deleteAccount = async (req, res) => {
  const userId = req.user.id

  try {
    await User.findByIdAndDelete(userId)
    res.json({ message: 'Account deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get User Account Data
export const getUserAccountData = async (req, res) => {
  const userId = req.user.id

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({
      message: 'User account data retrieved successfully',
      user,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
