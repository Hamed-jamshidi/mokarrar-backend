const express = require('express');
const { isLoggined } = require('../../middlewares/auth');
const router = express.Router()
const controller = require('./controller')



router.get('/allMissions',isLoggined, controller.getAllMissions);
router.get('/allMissions/:code',isLoggined, controller.getMissionByCode);
router.get('/deleteMissions/:missionId',isLoggined, controller.deleteMissions);
router.post('/newMission',isLoggined, controller.createNewMission);
router.post('/updateMission',isLoggined, controller.updateMission);


module.exports = router

 


