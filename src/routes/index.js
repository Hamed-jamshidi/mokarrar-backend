const express = require('express')
const router = express.Router()
const userRouter = require('./user')
const controlsRouter = require('./controls')
const materialsRouter = require('./materials')
const missionsRouter = require('./missions')
const stationsRouter = require('./stations')
// const eblaghiehRouter = require('.')
// const userRouter = require('./user')
// const userRouter = require('./user')
// const userRouter = require('./user')

// const licenseRouter = require('./license')
// const creditRouter = require('./credit')
// const authRouter = require('./auth')
// const adminRouter = require('./admin')


const { isLoggined, isAdmin } = require('../middlewares/auth')
const error = require('./../middlewares/error')
router.use('/user', userRouter)
router.use('/controls', controlsRouter)
router.use('/materials', materialsRouter)
router.use('/missions', missionsRouter)
router.use('/stations', stationsRouter)

router.use(error)
module.exports = router
