import Company from '../models/Company.js'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import {
  companySchema,
  updateCompanySchema,
} from '../schemas/companySchemas.js'

// Add Company
export const addCompany = async (req, res) => {
  const { error } = companySchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body

  try {
    const newCompany = new Company({
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR: req.user.id,
    })

    const savedCompany = await newCompany.save()
    res.status(201).json({
      message: 'Company created successfully',
      company: savedCompany,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update Company
export const updateCompany = async (req, res) => {
  const { error } = updateCompanySchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const companyId = req.params.companyId

  try {
    const company = await Company.findById(companyId)
    if (!company) return res.status(404).json({ error: 'Company not found' })

    if (company.companyHR.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not have the right permissions' })
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      req.body,
      { new: true }
    )
    res.json({
      message: 'Company updated successfully',
      company: updatedCompany,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete Company Data
export const deleteCompany = async (req, res) => {
  const companyId = req.params.companyId

  try {
    const company = await Company.findById(companyId)
    if (!company) return res.status(404).json({ error: 'Company not found' })

    if (company.companyHR.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not have the right permissions' })
    }

    await Company.findByIdAndDelete(companyId)
    res.json({ message: 'Company deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get Company Data
export const getCompanyData = async (req, res) => {
  const companyId = req.params.companyId

  try {
    const company = await Company.findById(companyId).populate('companyHR')
    if (!company) return res.status(404).json({ error: 'Company not found' })

    const jobs = await Job.find({ addedBy: company.companyHR._id })

    res.json({
      company,
      "This Company's Jobs":
        jobs.length > 0 ? jobs : 'This company has no jobs for now.',
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Search for a Company by Name
export const searchCompany = async (req, res) => {
  const { name } = req.query

  try {
    const companies = await Company.find({ companyName: new RegExp(name, 'i') })
    if (companies.length < 1) {
      return res.status(404).json({ error: 'No companies match this name.' })
    }
    res.json(companies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get All Applications for a Specific Job
export const getApplicationsForJob = async (req, res) => {
  const jobId = req.params.jobId

  try {
    // Finding the job to ensure it belongs to the requesting company
    const job = await Job.findById(jobId).populate('addedBy')
    if (!job) return res.status(404).json({ error: 'Job not found' })

    // Checking if the logged-in user is the company HR who posted the job
    if (job.addedBy._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not have the right permissions' })
    }

    const applications = await Application.find({ jobId }).populate('userId')
    res.json({
      message:
        applications.length > 0
          ? 'Applications retrieved successfully'
          : 'No applications yet',
      applications,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
