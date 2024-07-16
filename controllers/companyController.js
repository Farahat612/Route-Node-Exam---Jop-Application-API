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
