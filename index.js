const express = require('express');

const app = express();

const port = 9999;
// Import the Mongoose connection object from the mongoose.js file in the config directory
const db = require('./config/mongoose');

// Used for session cookie
const session = require('express-session');
//For Authentication
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');    // to store session information even after server restarts

// Middleware to parse incoming form data with 'urlencoded' payloads
// This enables handling of form submissions and populates 'req.body' with the parsed data.
app.use(express.urlencoded());

// Import express-ejs-layouts for layout support
const expressLayouts = require('express-ejs-layouts');

// Serve static files from the 'assets' directory
app.use(express.static('./assets'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Set up the view engine as EJS
app.set('view engine', 'ejs');

// Set the directory where views are located
app.set('views', './views');

const sessionMiddleware = session({
    name: 'PlacementCell',
    secret: 'CodingNinja',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie: {
        maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1/placement-cell",
        autoRemove: 'disabled', //Disable expired sessions cleaning
    }),
});

app.use(sessionMiddleware);

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// Use express router defined in the 'routes' module
app.use('/', require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log('Error in running server',err);
    }

    console.log("My Express server is working fine");
})
