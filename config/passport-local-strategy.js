const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

const User = require('../model/user');

// tell passport to use a new strategy for login
passport.use(new localStrategy({
    usernameField : 'email',
    passReqToCallback: true
},
 (req,email,password,done)=>{
    //  finding a user
    User.findOne({email : email},async (err , user)=>{

        if(err){
            return done(err)
        }
        var validPassword = false;
        if(user){
            // compare he password with encrypted db password
            validPassword = await bcrypt.compare(password, user.password);
        }
    
        // checking if user id or password is correct or not
        if(!user || validPassword != true ){
            req.flash('error','invalid email or password');
            return done(null, false);
        }
        return done(null, user)
    });
}
));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}
