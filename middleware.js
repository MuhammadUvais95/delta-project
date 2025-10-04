const Listing  = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to perform any actions!");
        return res.redirect("/login");
    }
    next();
};

// redirectUrl variable above(to save the current user's activity/rout/path)
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// LISTING OWNER
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/ ${id}`);
    }
    next();
};
  // REVIEW OWNER
module.exports.isReviewOwner = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this review!");
       return res.redirect(`/listings/${id}`);
    }
    next();
};

// server error checking method for listing(in create and update rout) 
module.exports.validateListing = (req, res, next) => {
const { error } = listingSchema.validate(req.body);
if(error){
     const errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
} else {
    next();
}
};

//   server error checking method for review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};



