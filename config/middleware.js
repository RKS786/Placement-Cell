//This middleware is responsible for setting flash messages in the response locals object,
// making them available to the views.
module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        "success": req.flash("success"),
        "error": req.flash("error")
    }

    next();
}