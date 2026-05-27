const express = require("express");
const router = express.Router();
const  searchBarController  = require("../controllers/searchBar");

router.get("/search", searchBarController.search);
router.get("/suggestions", searchBarController.suggestions);



module.exports = router;