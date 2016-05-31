// Get about page //
module.exports.about = function(req, res){
    res.render("aboutus", {
        title: "About KBBQ.SPACE",
        content: "KBBQ.SPACE was built to help you find the right Korean barbecue place to fulfill your KBBQ cravings.\n\nLet us find the restaurant you are looking for! Whether you liked or disliked the restaurant, please leave a rating to help the others like you."
    });
};

module.exports.angularApp = function(req, res){
    res.render("layout", { title: "KBBQ.SPACE" });
};