const express = require('express');

const companyController = require('../controllers/company_controller');
const passport = require('../config/passport-local-strategy');
const router = express.Router();

// -------- Get requests ----------
router.get('/home',passport.checkAuthentication, companyController.companyPage);

router.get('/allocate', passport.checkAuthentication, companyController.allocateInterview);

// -------- Post Requests ---------

router.post('/schedule-interview',passport.checkAuthentication, companyController.scheduleInterview);
router.post('/update-status/:id',passport.checkAuthentication, companyController.updateStatus);

module.exports = router;