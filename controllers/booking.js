const Listing = require("../models/listing");
const Booking = require("../models/bookingModel");
const User = require("../models/user");


module.exports.renderBookingForm = async(req, res) => {
   try{
       let listing = await Listing.findById(req.params.id);
       if(!listing){
        return res.status(404).json({message: "Listing not found"});
       }
       res.render("listings/reserveBooking.ejs", { listing });  
   }catch(err) {
     console.log("Error is ::", err);
     return res.status(500).json(`message: Internal server error is :: ${err}`);
   }
}





module.exports.createBooking  = async(req, res) => {
    try{
        let{ id } = req.params;
        let{ checkIn, checkOut, totalRent } = req.body;

        let listing = await Listing.findById(id);
        if(!listing) {
            return res.status(404).json({message: "Listing Does not Found!"});
        }
        if(new Date(checkIn) >= new Date(checkOut)){
            req.flash("error", "Invalid checkIn/checkOut");
            return res.redirect(`/listings/${listing._id}/createBooking`);
        }
        if(listing.isBooked){
            req.flash("warning", "This Listing is already booked!");
            return res.redirect(`/listings/${listing._id}`);
        }
        let booking = await Booking.create({
            checkIn,
            checkOut,
            totalRent,
            guest: req.user._id,
            host: listing.owner,
            listing: listing._id, 
        });

        const user = await User.findByIdAndUpdate(req.user._id, {
            $push: {booking: booking._id }
        }, {new: true});

        if(!user) {
            req.flash("error", "User does not exist!");
            return res.status(404).json({message: "User is not found"});
        }

        listing.isBooked = true;
        
        await listing.save();
        req.flash("success", "Booking confirmed successfully!")
        res.render("listings/bookingDetails.ejs", {booking});

    }catch(err) {
        console.log("Error is ::", err);
        req.flash("error", `Booking Error :: ${err}` );
        return res.status(500).json({message: `Booking error : ${err}`});
    }
}


// module.exports.cancelBooking = async(req, res) => {
//     try{
//         const{ bookingId } = req.params;
//          console.log("Cancel route hit");
//          console.log(req.params);
//         const booking = await Booking.findById(bookingId);
//         if(!booking) {
//             return res.status(404).json({message: "Booking does not exist!"});
//         }
//         // update Listing
//         await Listing.findByIdAndUpdate(booking.listing,
//              {$set: {isBooked: false }
//                 });
//                 // remove the BookingId from User model
//         await User.findByIdAndUpdate(booking.guest, { $pull : { booking : bookingId }});
//         await Booking.findByIdAndDelete(bookingId);
//         req.flash("success", "Booking has been cancelled successfully!");
//         return res.redirect("/listings");

//     } catch(err) {
//         console.log("Error is ::", err);
//         return res.status(500).json({message: "Booking canceling error!"});
//     }

// }