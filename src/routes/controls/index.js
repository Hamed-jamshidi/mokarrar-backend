const express = require('express');
const { isLoggined } = require('../../middlewares/auth');
const router = express.Router()
const controller = require('./controller')



router.get('/allControls',isLoggined, controller.getAllControls);
router.get('/allControls/:code',isLoggined, controller.getControlByCode);
router.get('/deleteControls/:constrolsId',isLoggined, controller.deleteControls);
router.post('/newControler',isLoggined, controller.createNewControl);
router.post('/updateControls',isLoggined, controller.editControls);


module.exports = router

 


