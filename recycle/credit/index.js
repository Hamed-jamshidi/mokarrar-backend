const express = require('express')
const router = express.Router()
const controller = require('./controller')


router.post('/', controller.insertCredit)
router.get('/:productId', controller.getCreditList);



module.exports = router
