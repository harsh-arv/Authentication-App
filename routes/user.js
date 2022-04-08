const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const passport = require('passport');


// create user into the DB
router.post('/create' , userController.create );

// Sign-in user with authentication using passport
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/user/sign-in'}
) , userController.createSession );

// update or reset the password
router.post('/update/:id', passport.checkAuthentication, userController.update);
router.get('/reset/:id', passport.checkAuthentication, userController.reset);

// signing out the user
router.get('/sign-out', userController.destroySession );

// rendering pages
router.get('/sign-up', userController.signUp );
router.get('/sign-in', userController.signIn );
router.get('/home', userController.home );

// google sign in  using passport oauth
router.get('/auth/google', passport.authenticate('google', {scope: ['profile' , 'email']}));
router.get( '/auth/google/callback', passport.authenticate('google' , {failureRedirect: '/user/sign-in'}), userController.createSession);


module.exports = router;