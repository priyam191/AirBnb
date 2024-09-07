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
        type: String,
        default: "https://tse1.mm.bing.net/th?id=OIP.EWrfkbPiZD8M8NmjhByRcQHaFj&pid=Api&P=0&h=180",     // by default this image's link will be printed
        set: (v) => v === "" ? "https://tse1.mm.bing.net/th?id=OIP.EWrfkbPiZD8M8NmjhByRcQHaFj&pid=Api&P=0&h=180" : v,
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