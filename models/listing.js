const { required, ref } = require("joi");
const mongoose= require("mongoose");
const { ReviewSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// creating schema     
const listingSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    location: String,
    country: String,
    id: String,
    image: {
        url:  String,
        filename: String,
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    coords: {
        lat: Number,
        lng: Number,
    }
});

// middleware for deleting the all reviews when deleting the listing
listingSchema.post("findOneAndDelete", async(listingData) => {
    if(listingData){
        await Review.deleteMany({ _id: {$in : listingData.reviews} });
    }
});

// creating  model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;