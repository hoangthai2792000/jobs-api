const User = require('../models/User')
const customError = require('../errors/customError')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()

  res.status(201).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new customError('Email and password must be provided', 400)
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new customError(`Can not find any user with email: ${email}`, 401)
  }

  const isPasswordCorrect = await user.checkPassword(password)

  if (!isPasswordCorrect) {
    throw new customError('Wrong password, please try again', 401)
  }

  const token = user.createJWT()
  res.status(200).json({ user: { name: user.name }, token })
}

module.exports = { register, login }
