const bcrypt = require('bcrypt');
const User = require('../model/user');
const fetch = require("isomorphic-fetch");


// render user homepage
module.exports.home = (req,res)=>{
    return res.render('home');
}

// render user sign-up
module.exports.signUp = (req,res)=>{
    return res.render('sign-up');
}

// render user sign-in
module.exports.signIn = (req,res)=>{
    return res.render('sign-in');
}

// create user id in the database 
module.exports.create = (req,res)=>{
    
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'confirm password does not match');
        return res.redirect('back');
    }

    User.findOne({email : req.body.email}, (err,user)=>{
        if(err){console.log("Error in user Signing up"); Return;}
        
        if(!user){
            bcrypt.genSalt(10, async function(err, salt) {
                const hashpassword = await bcrypt.hash(req.body.password , salt);
                req.body.password = hashpassword ;
                User.create({
                    name : req.body.name,
                    password : req.body.password,
                    email : req.body.email
                }, ()=>{
                    if(err){console.log("Error in Creating User"); Return;}
                    req.flash('success' ,'Sign-up Sucessfully!!')
                    return res.redirect('/user/sign-in');
                })
            });

        }else{
            // add flash messeage "user already exist"
            req.flash('error' , 'user already exist')
            return res.redirect('back');
        }

    } )
}


// login to the user
module.exports.createSession = (req,res)=>{
    req.flash('success', 'logged in successfully');
    
    return res.redirect('/user/home');
}

// logout 
module.exports.destroySession = (req,res)=>{
    req.logout()
    req.flash('success', 'logged out successfully');
    return res.redirect('/');
}

// reset the password
module.exports.update = async function (req, res) {
    

    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    
                    user.password = hash;
                    user.save();
                    req.flash('success' , 'password successfully changed!');
                    return res.redirect('/user/home');
                });
            });
           

        } catch (err) {
            // req.flash('error' , err);
            return res.redirect('back');
        }


    } else {
        req.flash('error', 'Unautorized')
        return res.status(401).send('Unauthorized');

    }
}


// render reset password page
module.exports.reset = function (req, res) {
    User.findById(req.params.id, (err, user) => {

        return res.render('reset-password', {
            profile_user: user
        });
    });
}
