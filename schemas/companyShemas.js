import Joi from 'joi'

export const companySchema = Joi.object({
  companyName: Joi.string().required(),
  description: Joi.string().required(),
  industry: Joi.string().required(),
  address: Joi.string().required(),
  numberOfEmployees: Joi.string()
    .required()
    .pattern(/^\d+-\d+$/),
  companyEmail: Joi.string().email().required(),
})

export const updateCompanySchema = Joi.object({
  companyName: Joi.string().optional(),
  description: Joi.string().optional(),
  industry: Joi.string().optional(),
  address: Joi.string().optional(),
  numberOfEmployees: Joi.string().optional(),
  companyEmail: Joi.string().email().optional(),
})
