const Listing = require("../models/listing.js");
const { geocodeAddress } = require("../utils/geocode");
const  filters = require("../utils/categories.js");
const Booking = require("../models/bookingModel.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({})
  res.render("listings/index.ejs", { allListings, filters, selectedCategory: "",});
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let id = req.params.id.trim();
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "owner", // to show the reviewOwner name
      },
    })
    .populate("owner");

  // flash message
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createNewListing = async (req, res) => {
  try {
    // Image from Cloudinary
    const url = req.file.path;
    const filename = req.file.filename;

    // Create listing from form data
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // // Declare coords
    let coords = null;

    // Fetch coords if location is provided
    if (newListing.location) {
      const query = `${newListing.location}, ${newListing.country || ""}`;
      coords = await geocodeAddress(query.trim());
      if (coords) {
        newListing.coords = coords;
      } else {
        console.log("⚠️ No coords found for:", query);
      }
    }
    // Save to DB
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings");
  }
};



module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id.trim();
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); // blur the old image at edit page.
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};



module.exports.updateListing = async (req, res) => {
  console.log(req.body);
  console.log(req.file)
  try{
  let { id } = req.params;
   const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },     // reconstruct is used here. updated the listing including all the fields(except image)
    { new: true },
  );    
  if (typeof req.file != "undefined") {
    // if file is already exist it will work otherwise not.
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  // Re-fetch coordinates if location is provided
  if (listing.location) {
    const query = `${listing.location}, ${listing.country || ""}`;
    const coords = await geocodeAddress(query.trim());
    if (coords) {
      listing.coords = { lat: coords.lat, lng: coords.lng };
      await listing.save();
    } else {
      listing.coords = undefined;
      await listing.save();
    }
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
} catch(err) {
  console.log("Error is from update controller::", err);
  return res.status(500).json(`message: Error while updating Listing :: ${err}`);
}
}


module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};



// for filter category
module.exports.filteredCate = async (req, res) => {
    try{
          const { category } = req.params;
  let filteredCategory = await Listing.find({
    category: {
      $regex: new RegExp("^" + category + "$", "i"), // case insensitive
    },
  });
  if(!filteredCategory) {
    req.flash("error", "Listings category you requested for does not exist!")
  }
  res.render("listings/index.ejs", { allListings: filteredCategory, filters, selectedCategory: category });
 

    }catch(error){
       req.flash("error", "Something went wrong while creating the listing.");
       console.log("Error in Category Listing listing:", error);
       res.redirect("/");
    }

};
