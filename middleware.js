//this is a middleware function file, this file is created to do all the task like edit,delete etc while logged in 

module.exports.isLoggedIn = (req, res, next) =>{
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error", "you must logged in to create listing");
        return res.redirect("/login");

    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}