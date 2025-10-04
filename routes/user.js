const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router.route("/signup")
// RENDER SIGNUP FORM ROUT FOR NEW USER
.get(userController.signUpUserForm)
// CREATE ROUT
.post(wrapAsync(userController.createNewUser));


router.route("/login")
// RENDER LOGIN USER FORM ROUT
.get(userController.renderLoginUserForm)
// LOGIN ROUT
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login",failureFlash: true }),userController.loginUser);


// LOGOUT ROUT
 router.get("/logout", userController.userLogout);


module.exports = router;