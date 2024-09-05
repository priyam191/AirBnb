const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email: {
        type: String,
        requied:true
    }
});

userSchema.plugin(passportLocalMongoose);         // we use this line because this automatically implements username,salt,hashing

module.exports = mongoose.model('user', userSchema);