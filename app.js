if(process.env.NODE_ENV !== "production") {
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require('./models/listing.js');
const dbUrl = process.env.ATLASDB_URL;


 main().then(() => {
    console.log("connected to DB");
 })
 .catch((err) => {
    console.log(err);
 });
 async function main() {
      mongoose.connect(dbUrl);
     
 }

// to store session related information into ATLAS DB.
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
    secret: process.env.SECRET,
  },
    touchAfter: 24 * 60 * 60,  // session information will be updated after 24 hours while we are not interacting to that website's page. 
});

const sessionOptions = {
    store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true  // used to prevent from Cross Crypto Attack
        }
    }


// to add the path of views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// to parse the url(coming from HTML form) data into jason formate
app.use(express.urlencoded({extended: true}));
// for JSON payloads
app.use(express.json()); 
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const port = 8080;


// to add session
app.use(session(sessionOptions));
app.use(flash());


// to initialize the passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// for serialize or deserialize the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// using flash message from success key.
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // stores current user's session data/credentials
    next();
})



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error Handling middleware
app.use((err, req, res, next) => {
let { statusCode = 500, message = "something went wrong!" } = err;
res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
    console.log(`Server is listening on port :${port}`);
});




