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
