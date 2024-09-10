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


module.exports.createListing = async(req,res,next) =>{
        
    const newListing  = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing Created!");
    res.redirect("/listings");

// let {title, description, image, price, location} = req.body;
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listings updated");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}



