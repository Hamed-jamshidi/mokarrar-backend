const express = require('express')
const router = express.Router()
const controller = require('./controller')


router.get('/', controller.dashboard)
router.get('/me',  controller.me)
router.post('/filterUserName',  controller.filterUserName)

router.get('/userPerCredit',  controller.percentUserPerCrdit)


module.exports = router
