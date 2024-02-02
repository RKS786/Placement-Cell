const express = require('express');
const router = express.Router();

console.log('user router loaded');

const userController = require('../controllers/users_controller');
const passport = require('../config/passport-local-strategy');

router.get('/sign-up', userController.signUp);
router.get('/profile', passport.checkAuthentication, userController.profile);
router.get('/add-student', passport.checkAuthentication, userController.addStudent);
router.get('/delete-student/:id',passport.checkAuthentication, userController.deleteStudent)
router.get('/download-csv', passport.checkAuthentication, userController.downloadCsv);

router.post('/create', userController.create);
router.post('/create-student',passport.checkAuthentication, userController.createStudent);

router.post('/create-session', passport.authenticate('local', {failureRedirect: '/'}), userController.createSession);
router.get('/sign-out', userController.destroySession);


module.exports = router;