const mongoose = require('mongoose');

const userDBSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    
    avatar: {
        type: String
    }
}, {
    timestamps: true
});


// Create the User model with the defined schema  
const User = mongoose.model('User', userDBSchema);

// Export the User model for use in other parts of the application
module.exports = User;