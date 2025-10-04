const express = require("express");
// for nested routers see in review routers.
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
 

// POST REVIEW ROUT
router.post("/", isLoggedIn, validateReview, wrapAsync( reviewController.createReview));


// DELETE REVIEW ROUT
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync( reviewController.destroyReview));


module.exports = router;