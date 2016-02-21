
// Get home page //
module.exports.homelist = function(req, res){
    res.render("locations-list", 
        {
        title: "KBBQ.SPACE - Find the best KBBQ",
        pageHeader: {
            title: "Matna BBQ",
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
module.exports.locationInfo = function(req, res) {
    res.render("location-info", {
        title: "Matna BBQ",
        pageHeader: {
            title: "Matna BBQ"
        },
        sidebar: {
            context: "is listed on KBBQ.SPACE because is has great selection of fresh meat, veggies and seafood. If you liked the restaurant, or if you didn't, please leave a review to help others like you."
        },
        location: {
            name: "Matna BBQ",
            address: "500 S Main St, Las Vegas, NV 89101",
            rating: 4,
            features: ["AYCE", "Premium Beef", "Pork", "Charcoal"],
            coords: {lat: 36.1671542, lng: -115.1523249},
            openingTimes: [{
                days: "Monday - Friday",
                opening: " 11:00am",
                closing: " 11:00pm",
                closed: false
            } , {
                days: "Saturday",
                opening: " 11:00am",
                closing: " 1:00am",
                clsed: false
            } , {
                days: "Sunday",
                opening: " 11:00am",
                closing: " 10:00pm",
                closed: false
            }],
            reviews: [{
                author: "Flubby Lee",
                rating: 3,
                timestamp: "February 18, 2016",
                reviewText: "Good quality meat but little pricey. I highly recommend prime ribs. Sooo goood!! Service was okay.."
            } , {
                author: "Pil Kim",
                rating: 5,
                timestamp: "February 20, 2016",
                reviewText: "Cannot find anything negative about this place. Fair price and good quality food! Can't wait to go back."
            }]
        }
    });
};

// Get Add Review //
module.exports.addReview = function(req, res){
    res.render("location-review-form", {
        title: "Review Matna BBQ on KBBQ.SPACE",
        pageHeader: { title: "Review Matna BBQ"}
    });
};