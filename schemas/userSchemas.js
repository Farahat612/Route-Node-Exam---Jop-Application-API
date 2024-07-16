import Joi from 'joi'

export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  recoveryEmail: Joi.string().email().optional(),
  DOB: Joi.date().required(),
  mobileNumber: Joi.string().required(),
  role: Joi.string().valid('User', 'Company_HR').required(),
})

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  mobileNumber: Joi.string().optional(),
  recoveryEmail: Joi.string().email().optional(),
  DOB: Joi.date().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
})

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
})

export const recoveryEmailSchema = Joi.object({
  email: Joi.string().email().required(),
})
