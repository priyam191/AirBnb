const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true, // Fixed typo here
    },
});

// Automatically adds username, salt, and hash fields and relevant methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);