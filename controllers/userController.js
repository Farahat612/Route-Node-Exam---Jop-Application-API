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
