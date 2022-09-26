const customError = require('../errors/customError')
const Job = require('../models/Job')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(200).json({ totalJobs: jobs.length, jobs })
}

const getSingleJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  })

  if (!job) {
    throw new customError(`No job with the id:${jobId}`, 404)
  }

  res.status(200).json({ job })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  // console.log(req.user)
  res.status(201).json({ job })
}
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req

  if (!company || !position) {
    throw new customError('Please provide company and position', 400)
  }

  // console.log(req.body)

  const job = await Job.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  )

  if (!job) {
    throw new customError(`No job with the id:${jobId}`, 404)
  }

  res.status(200).json({ job })
}

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findByIdAndDelete({
    _id: jobId,
    createdBy: userId,
  })

  if (!job) {
    throw new customError(`No job with the id:${jobId}`, 404)
  }

  res.status(200).json({ msg: 'Delete successfully' })
}

module.exports = { getAllJobs, getSingleJob, createJob, updateJob, deleteJob }
