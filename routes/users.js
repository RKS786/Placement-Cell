const express = require('express');
const router = express.Router();

console.log('user router loaded');

const userController = require('../controllers/users_controller');

router.get('/sign-up', userController.signUp);

router.post('/sign-in',  userController.signIn);
router.post('/create', userController.create);


module.exports = router;