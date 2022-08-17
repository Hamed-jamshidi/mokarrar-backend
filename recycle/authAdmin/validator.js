const expressValidator = require('express-validator')
const check = expressValidator.check

module.exports = new (class {
  registerValidator() {
    return [
      check('firstname').not().isEmpty().withMessage('firstname cant be empty'),
      check('lastname').not().isEmpty().withMessage('lastname cant be empty'),
      check('email').isEmail().withMessage('email is invalid'),
      check('password').not().isEmpty().withMessage('password cant be empty'),
      check('username').not().isEmpty().withMessage('username cant be empty'),
    ]
  }
  loginValidator() {
    return [
      check('username').not().isEmpty().withMessage('username can not empty'),
      check('password').not().isEmpty().withMessage('password cant be empty'),
    ]
  }
  profileValidator() {
    return [
      check('newPassword').not().isEmpty().withMessage('new password can not empty'),
      check('currentPassword').not().isEmpty().withMessage('current password cant be empty'),
    ]
  }
})()
