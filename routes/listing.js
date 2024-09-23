const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
        validateListing,        //we pass validateListing as a middleware
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing)
    
    );
    

router.get("/new", isLoggedIn, listingController.renderNewForm);
    
router.route("/:id")
.get(  wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,
    upload.single("listing[image"),wrapAsync(listingController.updateListing))  //function of upload is managing the image data send in the backend by the form 
.delete(isLoggedIn,isOwner,  wrapAsync(listingController.destroyListing));









//edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));





module.exports = router;