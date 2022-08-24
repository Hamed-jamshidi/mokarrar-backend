const express = require('express');
const { isLoggined } = require('../../middlewares/auth');
const router = express.Router()
const controller = require('./controller')



router.get('/allStations',isLoggined, controller.getAllStations);
router.get('/deleteStations/:stationId',isLoggined, controller.deleteStations);
router.post('/newStation',isLoggined, controller.createNewStation);
router.post('/updateStation',isLoggined, controller.updateStation);


module.exports = router

 


