// Controller function to sign in and create a session for user
module.exports.createSession = function(req, res) {
    
    console.log("session creation in work")
    // req.flash("success","Logged In Successfully");
    return res.redirect('back');
};