if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




main()
.then(() =>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}

const initData = require("./init/data.js");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));  //data which are coming in req , they can be parsed for this line
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));       // this step means we are accessing the static files through this which are in the public folder

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly: true,
    },
};

// app.get("/", (req,res) =>{
//     res.send("i am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());               // after login user's all the work will be stored here 
passport.deserializeUser(User.deserializeUser());           // after logout work 

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;         // we can't use req.user in the ejs files, that's why we are storing req.user in the locals to use in the ejs file
    next();
});





app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);






app.all("*", (req, res, next) =>{
    next(new expressError(404, "page not found"));
});

app.use((err, req, res, next) =>{
    let{ statuscode=500, message="something went wrong"} = err;
    res.status(statuscode).render("error.ejs", { message });
    // res.status(statuscode).send(message);
});

app.listen(8080, () =>{
    console.log("server is listening to  port 8080");
});
