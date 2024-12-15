const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true, // Ensures comment is mandatory
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating value
        max: 5, // Maximum rating value
    },
    createdAt: {
        type: Date,
        default: Date.now, // Fixed: Use `Date.now` (not `Date.now()`)
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // Ensures a review must have an author
    },
});

module.exports = mongoose.model("Review", reviewSchema);