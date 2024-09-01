const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() =>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await listing.deleteMany({});       // if there exist any data in database then it clears all the data
    await listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();