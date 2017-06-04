module.exports = function (req, res, next) {
  console.log("isLoggedIn runs");
  if (!req.user) {
    req.flash('error', 'You must be logged in to access that page')
    res.redirect('/backend/login')
    return
  } else {
    next()
    return
  }
}
