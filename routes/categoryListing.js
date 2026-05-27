const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const  filteredCategoryController  = require("../controllers/categoryListing.js");



router.get("/:category", filteredCategoryController.filteredCate);



module.exports = router;
