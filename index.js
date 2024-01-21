const express = require('express');

const app = express();

const port = 9999;

app.listen(port,function(err){
    if(err){
        console.log('Error in running server',err);
    }

    console.log("My Express server is working fine");
})
