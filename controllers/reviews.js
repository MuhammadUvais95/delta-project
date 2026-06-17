const Listing = require("../models/listing")
const Review = require("../models/review")


module.exports.createReview = async(req, res) => {
    try{
        console.log("Req.body:",req.body);
        const listing  = await Listing.findById(req.params.id);
    // create new review and receive it from request body and its object which is review.
    const newReview = new Review(req.body.review);
    console.log(newReview)
    if(!newReview.comment || newReview.comment.trim() === "") {
        // return res.json({message: "Review not created"});
        req.flash("error", "comment is required!");
    }

    newReview.owner = req.user._id;  // add the owner to  the review
    const reviewStoredToMongoDB = listing.reviews.push(newReview);
    //save them
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
    }
    catch(err) {
        console.log("Error is in new review creating:", err);
        return res.status(500).json({message: `Error is in : ${err}`});
    }
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