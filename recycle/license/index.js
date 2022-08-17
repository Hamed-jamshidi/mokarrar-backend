const express = require('express')
const router = express.Router()
const controller = require('./controller')


router.post('/generate', controller.generateLicense)
// router.post('/filteredLicense', controller.filterLicense);
router.get('/chartLicenseUser/:productType', controller.chartLicenseUser);
router.get('/', controller.filterLicense);
router.get('/:productType', controller.getLicenseList);
router.post('/filterLicense', controller.getLicenseListFiltered);


module.exports = router

 