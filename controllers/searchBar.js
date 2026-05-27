const Listing = require("../models/listing");

module.exports.search = async(req, res) => {
    try{
        const { query } = req.query;
        if(! query.trim() === "") {
            return res.status(400).json({message: "Serach query is required"})
        }
        const searchListings = await Listing.find({
            $or: [
                {category: {$regex: query, $options: "i"} },
                {country: { $regex: query, $options: "i"} },
                { title: { $regex: query, $options: "i"} },
                { location: { $regex: query, $options: "i"} }
            ]
        })
        // return res.status(200).json(listing);
        res.render("listings/searchListing.ejs", { searchListings, query })
    } catch(err){
        console.log("Search Error:", err);
        return res.status(500).json({message: "Internal Server Error"})

    }
}



module.exports.suggestions = async(req, res) => {
    try{
    const { query } = req.query;
    if(!query || query.trim() === ""){
        return res.status(400).json({message: "query is required!"})
    }
    const suggestions = await Listing.find({
        $or:[
            {title: { $regex: query, $options: "i"} },
            {location: { $regex: query, $options: "i"} },
            {country: {$regex: query, $options: "i"} },
            { amount: { $regex: `^${query}`, $options: "i"} }
        ]
    })
    .limit(20)
    .select("title");
     res.json(suggestions);
}catch(err) {
    console.log("Error is ::", err);
    res.status(500).json({mesage: "Internal Server error"});
}
}