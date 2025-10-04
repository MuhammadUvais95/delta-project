const User = require("../models/user");



module.exports.signUpUserForm = (req, res) => {
    res.render("users/signup.ejs");
}



module.exports.createNewUser = async (req, res) => {
    try{
    let { username, email, password } = req.body;
     const newUser = new User({ email, username });
     const registeredUser = await User.register(newUser, password);
     req.login(registeredUser, (err) => {
        if(err) {
            next(err);
        }
          req.flash("success", "Welcome to Wanderlust!");
          res.redirect("/listings");
     });
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}



module.exports.renderLoginUserForm = (req, res) => {
    res.render("users/login.ejs");
}



module.exports.loginUser = async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
 }



 module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            next(err);
        }
         req.flash("success", "You are logged out!");
         res.redirect("/listings");
    });   
 }