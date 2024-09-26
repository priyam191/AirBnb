//this is a middleware function file, this file is created to do all the task like edit,delete etc while logged in 
const Listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require('./schema.js');

module.exports.isLoggedIn = (req, res, next) =>{
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error", "you must logged in to create listing");
        return res.redirect("/login");

    }res.locals.currUser = req.user;
    next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body.listing);

        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new expressError(400, error);
        }else{
            next();
        }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);         
        
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new expressError(400, error);
        }else{
            next();
        }
};


module.exports.isReviewAuthor = async (req, res, next) =>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the user of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}