const express = require('express');

const app = express();

const port = 9999;

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


// Use express router defined in the 'routes' module
app.use('/', require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log('Error in running server',err);
    }

    console.log("My Express server is working fine");
})
