const express = require('express')
const router = express.Router()
const controller = require('./controller')


router.get('/sayhello', controller.sayHello);
router.get('/allControls', controller.getAllControls);
// router.get('/percentCreditType', controller.calcPercentCreditType);
// router.get('/users', controller.getAllUsers);
// router.get('/getUserNameById/:userId', controller.getUserNameById);
// router.get('/licenseList', controller.getListOfLicenseWithType);
// router.get('/getAllLicenses', controller.getAllLicenses);
// router.get('/creditList/:creditType', controller.getCreditList);
// router.get('/deleteCreditById/:creditId', controller.deleteCreditById);
// router.get('/creditsList/:creditType', controller.getCreditsList);
// router.get('/LicensesList/:licenseType', controller.getLicenseList);
// router.post('/updateCredit', controller.updateCredit);
// router.get('/userInfo/:userId', controller.getUserInfo);
// router.get('/licenseUser/:userId', controller.getUserLicenseList);
// router.get('/creditUser/:userId', controller.getUserCreditList);
// router.get('/creditChartData', controller.getCreditChartData);
// router.get('/licenseChartData', controller.getLicenseChartData);
// router.get('/filterUserName/:searchData', controller.getUserNameData);
// router.post('/filterLicense', controller.getLicenseListFiltered);
// router.post('/changeUserPassword', controller.changePasswordUser);
// router.post('/DeleteCredit', controller.deleteCredit);
// router.post('/newCredit', controller.createNewCredit);

module.exports = router

 


