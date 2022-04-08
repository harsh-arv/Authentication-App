const express = require('express');
port = process.env.PORT || 3000;
const app = express();
const cookieParser = require('cookie-parser');
const expressLayout  = require('express-ejs-layouts');

// database connection
const db = require('./config/mongoose');

// passport connection
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-strategy');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// flash message connection
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(express.urlencoded());
app.use(cookieParser());


// adding a static path to use css , js , images
app.use(express.static('./assets'));

// using express layout
app.use(expressLayout);
// extracting style and script from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// setting up view engine
app.set('view engine' , 'ejs');
app.set('views' , './view');


// creating session 
app.use(session({
    name: 'Authentication',
    // TODO change the secret before deployment in production mode
    secret: 'noOneWillKnow',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


// adding flash messages
app.use(flash());
app.use(customMware.setflash);

// making routes
app.use('/', require('./routes'));


// connecting to the express server
app.listen(port,(err)=>{
    if(err){
        console.log("Error crearting server", err);
        return ;
    }
    console.log(`connecting to the server on http://localhost:${port}`);
});