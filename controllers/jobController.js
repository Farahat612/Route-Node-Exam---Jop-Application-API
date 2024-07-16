import Job from '../models/Job.js'
import Company from '../models/Company.js'
import Application from '../models/Application.js'
import Joi from 'joi'
import {
  jobSchema,
  updateJobSchema,
  applyJobSchema,
  filterJobSchema,
} from '../schemas/jobSchemas.js'

// Add Job
export const addJob = async (req, res) => {
  const { error } = jobSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body

  try {
    const newJob = new Job({
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy: req.user.id,
    })

    const savedJob = await newJob.save()
    res.status(201).json({
      message: 'Job created successfully',
      job: savedJob,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
