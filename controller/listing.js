const Listing = require("../models/listing");

module.exports.index = async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs")
};

module.exports.showListing = async(req, res, next) =>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate({path: "reviews", populate:{
        path: "author",
    },
    })
    .populate("owner");
    res.render("listings/show.ejs", {listing});
};


module.exports.createListing = async (req, res, next) => {
    try {
        console.log("req.body:", req.body); // Log the request body
        console.log("req.file:", req.file); // Log file information
        console.log("req.user:", req.user); // Log user info (if applicable)

        const newListing = new Listing(req.body.listing);
        newListing.image = { url: req.file.path, filename: req.file.filename };
        newListing.owner = req.user._id; // Assuming the user is logged in

        await newListing.save();
        req.flash("success", "New listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.log("Error in createListing:", err); // Log any errors
        next(err); // Pass it to the error-handling middleware
    }
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    if(! listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async(req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if( typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;   
    listing.image = {url, filename};    //new url
    await listing.save();
    }       // if file exist in request then only this if condition will work otherwise it will return undefined
    
    req.flash("success", "Listings updated");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}



