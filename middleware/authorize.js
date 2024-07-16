// middleware/authorize.js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You do not have the right permissions' })
    }
    next()
  }
}

export default authorize
