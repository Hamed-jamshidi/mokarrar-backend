const express = require('express');
const { isLoggined } = require('../../middlewares/auth');
const router = express.Router()
const controller = require('./controller')



router.get('/allMaterials',isLoggined, controller.getAllMatrials);
router.get('/deleteMaterial/:materialId',isLoggined, controller.deleteMaterial);
router.post('/createMaterial',isLoggined, controller.createNewMaterial);
router.post('/updateMaterial',isLoggined, controller.updateMaterial);


module.exports = router

 


