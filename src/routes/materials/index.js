const express = require('express');
const { isLoggined } = require('../../middlewares/auth');
const router = express.Router()
const controller = require('./controller')



router.get('/allMaterials',isLoggined, controller.getAllMatrials);
router.get('/deleteControls/:constrolsId',isLoggined, controller.deleteControls);
router.post('/createMaterial',isLoggined, controller.createNewMaterial);
router.post('/updateControls',isLoggined, controller.editControls);


module.exports = router

 


