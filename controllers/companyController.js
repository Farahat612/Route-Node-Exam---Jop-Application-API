import Company from '../models/Company.js'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import { companySchema, updateCompanySchema } from '../schemas/companyShemas.js'

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
