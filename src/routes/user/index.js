const express = require('express');
const { isLoggined } = require('../../middlewares/auth');
const router = express.Router()
const controller = require('./controller')


router.get('/sayhello', controller.sayHello);
router.post('/register',isLoggined , controller.register);
router.post('/login', controller.login); 
router.post('/changePassword',isLoggined ,controller.changePassword);


module.exports = router

 


