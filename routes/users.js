const express = require('express');
const router = express.Router();

console.log('user router loaded');

const userController = require('../controllers/users_controller');


router.post('/create-session',  userController.createSession);


module.exports = router;