const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, rendersignupform, renderloginform, login, logout } = require("../controller/users.js");


router.get("/signup", rendersignupform);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderloginform);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), userController.login);

router.get("/logout", userController.logout);

module.exports = router;