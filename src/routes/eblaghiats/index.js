const express = require('express');
const { isLoggined } = require('../../middlewares/auth');
const router = express.Router()
const controller = require('./controller')



router.get('/allEblaghiat/:cards',isLoggined, controller.getAllEblaghiat);
router.get('/deleteEblaghies/:eblagheId',isLoggined, controller.deleteEblaghiat);
router.post('/newEblaghie',isLoggined, controller.createNewEblaghie);
router.post('/updateControls',isLoggined, controller.editControls);


module.exports = router

 


