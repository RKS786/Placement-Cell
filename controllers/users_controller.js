console.log('user controller loaded');

const User = require('../models/users_db');

// Controller function to sign in for user
module.exports.signIn = function(req, res) {
    
     //steps to authenticate
    // check whether the user exists or not
    User.findOne({ email: req.body.email })
        .then(user => {
            // handle user found
            console.log(user);
            if (user) {
                if (user.password !== req.body.password) {
                   return Promise.reject("password does not match");
                }
                
                return res.render('user_profile', {
                                        title: 'User profile',
                                        user: user
                                    });
            } else {
                return Promise.reject("user does not exist");
            }
        })
        .catch(err => {
            console.error("Error in user sign in:", err);
            return res.redirect('back');
        });
    
};


// Controller function to get the sign-up data
module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {

            // req.flash("error", "Password and confirm password does not match");
            return res.redirect('back');
        }

        // Using async/await
        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {

            const newUser = await User.create(req.body);
            console.log("User created successfully:", newUser);
            // req.flash("success","User created successfully");
            return res.redirect('/');

        } else {

            // req.flash("error", "User already exists");
            console.log("User already exist");
            return res.redirect('back');

        }
    } catch (err) {

        console.error("Error in user creation:", err);
        // req.flash("error", "Error in user creation");
            return res.redirect('back');

    }
};


// Controller function to render the sign up page
module.exports.signUp = function(req, res){

  return  res.render('user_sign_up',{
        title:"Placement Cell | Sign Up"
    });
};