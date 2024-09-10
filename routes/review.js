const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing= require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);         
        
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new expressError(400, error);
        }else{
            next();
        }
};


router.post("/", isLoggedIn, validateReview, wrapAsync(async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
   
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);

}));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req,res) =>{
    let { id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;