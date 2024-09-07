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
    initData.data =initData.data.map((obj) =>({...obj, owner: "66d9c4dc0d053846e187f8c1"}));   //map function creates new array and this current property will be inserted into the new array
    await listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();