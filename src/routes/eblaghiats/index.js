const express = require('express');
const { isLoggined } = require('../../middlewares/auth');
const router = express.Router()
const controller = require('./controller')



router.get('/allProducts/:cards',isLoggined, controller.getAllProducts);
router.get('/getProcess/:batchNum',isLoggined, controller.getProcess);



router.get('/deleteProcess/:processId',isLoggined, controller.deleteProcess);

router.post('/newProduct',isLoggined, controller.createProduct);
router.post('/newProcess',isLoggined, controller.createProcess);
router.post('/updateProduct',isLoggined, controller.updateProduct);
router.post('/updateProcess',isLoggined, controller.updateProcess);
// router.get('/deleteEblaghies/:eblagheId',isLoggined, controller.deleteEblaghiat);
// router.post('/newEblaghie',isLoggined, controller.createNewEblaghie);
// // router.post('/updateControls',isLoggined, controller.editControls);


module.exports = router
