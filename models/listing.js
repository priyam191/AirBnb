const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:{ 
        url: String,
        filename: String,
    },      // this is a set function of image, if there is an empty string then this link's image will be printed 
    price: Number,
    location: String,
    counry: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Listing  = mongoose.model("listing", listingSchema);
module.exports = Listing;