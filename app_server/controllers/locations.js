
// Get home page //
module.exports.homelist = function(req, res){
    res.render("locations-list", 
        {
        title: "KBBQ.SPACE - Find the best KBBQ",
        pageHeader: {
            strapline: "Find Nearby KBBQ"
        },
        sidebar: "Craving good Korean BBQ? KBBQ.SPACE helps you find Korean BBQ restaurants near you! Let KBBQ.SPACE help you find the restaurant you are looking for.",
        locations: [{
            name: "Matna BBQ",
            address: "500 S Main St, Las Vegas, NV 89101",
            rating: 4,
            features: ["AYCE", "Charcoal", "Premium Beef", "Pork"],
            distance: "500 ft"
        } , {
            name: "Honey Boar",
            address: "2900 E Flamingo Rd, Las Vegas, NV 89121",
            rating: 5,
            features: ["AYCE", "Premium Pork"],
            distance: "2.3 mi"
        } , {
            name: "Chungdam Garden",
            address: "2702 N Green Valley Pkwy, Henderson, NV 89014",
            rating: 3,
            features: ["Premium Beef", "Premium Pork", "Lunch Special"],
            distance: "3.6 mi"
        }]
    });
};

// Get Location Info //
module.exports.locationInfo = function(req, res){
    res.render("location-info", {title: "Location Info"});
};

// Get Add Review //
module.exports.addReview = function(req, res){
    res.render("location-review-form", {title: "Add Review"});
};