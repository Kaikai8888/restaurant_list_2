const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const registerError = []
  if (!email || !password || !confirmPassword) {
    registerError.push({ message: '請確認是否漏填 Email、密碼 或 確認密碼' })
  }
  if (password !== confirmPassword) {
    registerError.push({ message: '密碼與確認密碼不一致' })
  }
  if (registerError.length) return res.render('register', { name, email, password, confirmPassword, registerError })

  User.findOne({ email })
    .then(user => {
      if (user) {
        registerError.push({ message: '這個 Email 已註冊' })
        return res.render('register', { name, email, password, confirmPassword, registerError })
      } else {
        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => User
            .create({ name, email, password: hash })
            .then(() => {
              req.flash('successMessage', '已成功註冊，歡迎登入使用')
              return res.redirect('/users/login')
            })
            .catch((error) => console.log(error)))
      }
    })
    .catch((error) => console.log(error))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('successMessage', '已成功登出')
  res.redirect('/users/login')
})

module.exports = router