const express = require("express");
const bookingController = require("../controllers/booking");
const { isLoggedIn } = require("../middleware");
const router = express.Router();

router.get("/:id/createBooking", isLoggedIn, bookingController.renderBookingForm );
router.post("/:id/confirmBooking", isLoggedIn, bookingController.createBooking );



router.get("/test", (req, res) => {
    res.send("Booking router working");
});


module.exports = router;
