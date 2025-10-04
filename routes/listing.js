const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
// to parse the multipart/form-data(to upload files).
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



router.route("/")
// INDEX ROUT
.get(wrapAsync (listingController.index))
// CREATE NEW LISTING ROUT
.post(validateListing, upload.single("listing[image]"), wrapAsync(listingController.createNewListing));


// RENDER NEW FORM CREAT ROUT  
router.get("/new", isLoggedIn, (listingController.renderNewForm));


router.route("/:id")
// SHOW ROUT
.get(wrapAsync( listingController.showListings))
// UPDATE ROUT
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
// DELETE ROUT
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


// EDIT ROUT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm));



module.exports = router;

