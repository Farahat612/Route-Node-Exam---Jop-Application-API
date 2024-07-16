import Application from '../models/Application.js'
import Company from '../models/Company.js'
import Job from '../models/Job.js'
import {
  filterJobSchema,
  jobSchema,
  updateJobSchema,
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

// Update Job
export const updateJob = async (req, res) => {
  const { error } = updateJobSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const jobId = req.params.jobId

  try {
    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    if (job.addedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not have the right permissions' })
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    })

    res.json({
      message: 'Job updated successfully',
      job: updatedJob,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete Job
export const deleteJob = async (req, res) => {
  const jobId = req.params.jobId

  try {
    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ error: 'Job not found' })

    if (job.addedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not have the right permissions' })
    }

    await Job.findByIdAndDelete(jobId)

    res.json({ message: 'Job deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// get all jobs with their companies information
export const getAllJobsWithCompanies = async (req, res) => {
  try {
    // Fetch all jobs with the HR user populated
    const jobsWithHR = await Job.find().populate('addedBy')

    // Map through each job to fetch the corresponding company using the populated HR user's ID
    const jobsWithCompanies = await Promise.all(
      jobsWithHR.map(async (job) => {
        const { addedBy: HR, ...rest } = job.toObject()
        const company = await Company.findOne({ companyHR: HR._id })
        return {
          ...rest,
          HR,
          company,
        }
      })
    )

    res.json({
      message: 'Jobs retrieved successfully',
      jobs: jobsWithCompanies,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get all Jobs for a specific company
export const getJobsForCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      companyName: {
        $regex: new RegExp('^' + req.query.companyName + '$', 'i'),
      },
    })

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const jobs = await Job.find({ addedBy: company.companyHR })

    res.status(200).json({
      message: `Jobs retrieved successfully for ${company.companyName} company`,
      jobs,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get Jobs by filters
export const getJobsByFilters = async (req, res) => {
  const { error } = filterJobSchema.validate(req.query)
  if (error) return res.status(400).json({ error: error.details[0].message })

  try {
    const filters = {}
    if (req.query.workingTime) filters.workingTime = req.query.workingTime
    if (req.query.jobLocation) filters.jobLocation = req.query.jobLocation
    if (req.query.seniorityLevel)
      filters.seniorityLevel = req.query.seniorityLevel
    if (req.query.jobTitle)
      filters.title = { $regex: req.query.jobTitle, $options: 'i' }
    if (req.query.technicalSkills)
      filters.technicalSkills = { $in: req.query.technicalSkills.split(',') }

    const jobs = await Job.find(filters)
    res.status(200).json({
      message: 'Jobs retrieved successfully',
      jobs,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Apply for a Job
export const applyToJob = async (req, res) => {
  try {
    const newApplication = new Application({
      jobId: req.body.jobId,
      userId: req.user._id,
      userTechSkills: req.body.userTechSkills,
      userSoftSkills: req.body.userSoftSkills,
      userResume: req.file.path, // Store the file path
    })
    const savedApplication = await newApplication.save()
    res.status(201).json(savedApplication)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
