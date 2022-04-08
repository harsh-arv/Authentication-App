const express = require('express');
const router = express.Router();
const homeController =require('../controller/homeController');


// route to render authentication homepage
router.get('/', homeController.home);

// creating a route for user 
router.use('/user', require('./user'));

module.exports=router;