const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        next(err);
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        req.flash("error", "Something went wrong!");
        next(err);
    }
};

module.exports.createListing = async (req, res, next) => {
    try {
        console.log("req.body:", req.body); // Log the request body
        console.log("req.file:", req.file); // Log file information
        console.log("req.user:", req.user); // Log user info (if applicable)

        const newListing = new Listing(req.body.listing);

        if (req.file) {
            newListing.image = { url: req.file.path, filename: req.file.filename };
        } else {
            newListing.image = { url: "default_image_url", filename: "default_filename" }; // Optional fallback
        }

        newListing.owner = req.user._id; // Assuming the user is logged in

        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error in createListing:", err);
        req.flash("error", "Failed to create listing!");
        next(err);
    }
};

module.exports.renderEditForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const originalImageUrl = listing.image.url;
        // Uncomment and adjust the transformation logic if necessary
        // originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (err) {
        console.error("Error fetching listing for edit:", err);
        req.flash("error", "Something went wrong!");
        next(err);
    }
};

module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            listing.image = { url, filename }; // Update with new image
            await listing.save();
        }

        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        req.flash("error", "Failed to update listing!");
        next(err);
    }
};

module.exports.destroyListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        req.flash("error", "Failed to delete listing!");
        next(err);
    }
};

module.exports.searchListings = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.redirect("/listings");
        }

        // Search in title, description, location, and country
        const allListings = await Listing.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { location: { $regex: q, $options: 'i' } },
                { country: { $regex: q, $options: 'i' } }
            ]
        });

        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error("Error searching listings:", err);
        req.flash("error", "Something went wrong with the search!");
        next(err);
    }
};
