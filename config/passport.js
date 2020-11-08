const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.js')


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) return done(null, false, { message: '這個 Email 尚未註冊' })
          if (!bcrypt.compare(password, user.password)) return done(null, false, { message: 'Email 或密碼錯誤' })
          return done(null, user)
        })
        .catch(error => done(error, false))
    }))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => User.findById(id)
    .lean()
    .then(user => done(null, user))
    .catch(error => done(error, false)))
}