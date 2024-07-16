import Joi from 'joi'

export const jobSchema = Joi.object({
  jobTitle: Joi.string().required(),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required(),
  workingTime: Joi.string().valid('part-time', 'full-time').required(),
  seniorityLevel: Joi.string()
    .valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO')
    .required(),
  jobDescription: Joi.string().required(),
  technicalSkills: Joi.array().items(Joi.string()).required(),
  softSkills: Joi.array().items(Joi.string()).required(),
})

export const updateJobSchema = Joi.object({
  jobTitle: Joi.string().optional(),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').optional(),
  workingTime: Joi.string().valid('part-time', 'full-time').optional(),
  seniorityLevel: Joi.string()
    .valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO')
    .optional(),
  jobDescription: Joi.string().optional(),
  technicalSkills: Joi.array().items(Joi.string()).optional(),
  softSkills: Joi.array().items(Joi.string()).optional(),
})

export const applyJobSchema = Joi.object({
  jobId: Joi.string().required(),
  userTechSkills: Joi.array().items(Joi.string()).required(),
  userSoftSkills: Joi.array().items(Joi.string()).required(),
})

export const filterJobSchema = Joi.object({
  workingTime: Joi.string().valid('part-time', 'full-time').optional(),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').optional(),
  seniorityLevel: Joi.string()
    .valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO')
    .optional(),
  jobTitle: Joi.string().optional(),
  technicalSkills: Joi.string().optional(), // Comma-separated values
})
