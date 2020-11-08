module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) return next()
    req.flash('errorMessage', '請先登入')
    return res.redirect('/users/login')
  }
}