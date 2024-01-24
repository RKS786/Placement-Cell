const express = require('express');
const router = express.Router();

console.log('user router loaded');

const userController = require('../controllers/users_controller');

router.get('/sign-up', userController.signUp);
router.get('/profile', userController.profile);
router.get('/add-student', userController.addStudent);
router.get('/delete-student/:id', userController.deleteStudent)


router.post('/sign-in',  userController.signIn);
router.post('/create', userController.create);
router.post('/create-student', userController.createStudent);


module.exports = router;