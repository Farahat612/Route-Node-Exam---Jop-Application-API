import mongoose, { Schema, model } from 'mongoose'

const applicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userTechSkills: { type: [String], required: true },
  userSoftSkills: { type: [String], required: true },
  userResume: { type: mongoose.Schema.Types.Mixed, required: true }, // Resume PDF
})

export default model('Application', applicationSchema)
