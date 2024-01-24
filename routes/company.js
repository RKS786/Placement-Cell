const express = require('express');

const companyController = require('../controllers/company_controller');
const router = express.Router();

// -------- Get requests ----------
router.get('/home', companyController.companyPage);

router.get('/allocate', companyController.allocateInterview);

// -------- Post Requests ---------

router.post('/schedule-interview', companyController.scheduleInterview);
router.post('/update-status/:id', companyController.updateStatus);

module.exports = router;