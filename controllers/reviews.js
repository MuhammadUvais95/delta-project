const Listing = require("../models/listing")
const Review = require("../models/review")


module.exports.createReview = async(req, res) => {
    const listing  = await Listing.findById(req.params.id);
    // create new review and receive it from request body and its object which is review.
    const newReview = new Review(req.body.review);
    newReview.owner = req.user._id;  // add the owner to  the review
    const reviewStoredToMongoDB = listing.reviews.push(newReview);
    //save them
    await newReview.save();
    await listing.save();
     req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}



module.exports.destroyReview = async(req, res) => {
    const { id, reviewId } = req.params;
    // delete review from reviews array(in listing schema) and update the listing by pulling/deleting it.
     const review = await Listing.findByIdAndUpdate(id, { $pull : { reviews: reviewId}});
    // delete review from Review model
    const reviewDeleted = await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}