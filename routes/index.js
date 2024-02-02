//imports the Express.js framework
const express = require('express');

//creates an instance of the Express router
const router = express.Router();

//The require() function is used to import the router modules defined in separate files
const homeController = require('../controllers/home_controller');

console.log('router loaded')

//When a GET request is made to '/', it invokes the home function from the homeController
router.get('/', homeController.home);

//For requests that start with '/users', the router forwards them to the router defined in the './users' module
router.use('/users', require('./users'));
//For requests that start with '/company', the router forwards them to the router defined in the './company' module
router.use('/company', require('./company'));

//export the router instance, making it available for use in other parts of the application
module.exports = router;