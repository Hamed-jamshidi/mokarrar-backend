const express = require('express')
const { isLoggined } = require('../../middlewares/auth')
const router = express.Router()
const controller = require('./controller')
const validator = require('./validator')

router.post('/register', validator.registerValidator(),controller.validate, controller.register)
router.post('/login', validator.loginValidator(),controller.validate, controller.login)
router.post('/profile', validator.profileValidator(),controller.validate,isLoggined, controller.changePassword)

module.exports = router
