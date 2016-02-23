var request = require("request");
/*var apiOptions = {
    server: "http://localhost:3000"
};*/
var apiOptions = {
    server: "https://damp-wildwood-88281.herokuapp.com";
}; 

var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function (distance) {
  var numDistance, unit;
    // ensuring a number as a parameter
  if (distance && _isNumeric(distance)) {
      // If distance is more than 1 mile, round to one decimal place and add mi unit. 1 mi = 1609.444m
    if (distance > 1609.444) {
      numDistance = parseFloat(distance/1609.444).toFixed(1);
      unit = ' mi';
    } else {
        // Convert ft to mi and round to nearest ft
      numDistance = parseInt(distance/0.3048, 10);
      unit = ' ft';
    }
    return numDistance + unit;
  } 
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404 - page not found";
    content = "Sorry. Looks like we can't find this page.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "Seems like there's a problem with our server.";
  } else {
    title = status + ", something's wrong";
    content = "Something is not right.";
  }
  res.status(status);
  res.render('aboutus', {
    title : title,
    content : content
  });
};

var renderHomepage = function(req, res, responseBody){
    var message;
      if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
      } else {
        if (!responseBody.length) {
          message = "Uh oh, no place found nearby";
        }
      }
    res.render("locations-list", {
        title: "KBBQ.SPACE - Find the best KBBQ",
        pageHeader: {
            strapline: "Find Nearby KBBQ"
        },
        sidebar: "Craving good Korean BBQ? KBBQ.SPACE helps you find Korean BBQ restaurants near you! Let KBBQ.SPACE help you find the restaurant you are looking for.",
        locations: responseBody,
        message: message
    });
};

// Get home page //
module.exports.homelist = function(req, res){
    var path = "/api/locations";
    // Set request options: URL, method, JSON body, hard-coded string param
    var requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
        qs: {
            lng: -115.081697,
            lat: 36.055400,
            maxDistance: 100000 // 100 km
        }
    };
    request(requestOptions, function (err, response, body){
      var i, data;
      data = body;
      if (response.statusCode === 200 && data.length) {
        for (i = 0; i < data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      renderHomepage(req, res, data);
   });
};

var getLocationInfo = function(req, res, callback){
    var path = "/api/locations/" + req.params.locationid;
    var requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request (requestOptions, function(err, response, body) {
        var data = body;
        if (response.statusCode === 200){
          data.coords = {
            lng: body.coords[0],
            lat: body.coords[1]
            };
            callback(req, res, data);
        } else {
            _showError(req, res, response.statusCode);
        }
    }
  );
};

var renderDetailPage = function(req, res, locDetail){
    res.render("location-info", {
        title: locDetail.name,
        pageHeader: {title: locDetail.name},
        sidebar: {
            context: "is listed on KBBQ.SPACE because is has great selection of fresh meat, veggies and seafood. If you liked the restaurant, or if you didn't, please leave a review to help others like you."
        },
        location: locDetail
    });
};    


// Get Location Info //
module.exports.locationInfo = function(req, res) {
    getLocationInfo(req, res, function(req, res, responseData){
        renderDetailPage(req, res, responseData);
    });
};

var renderReviewForm = function (req, res, locDetail) {
  res.render("location-review-form", {
    title: "Review " + locDetail.name + " on KBBQ.SPACE",
    pageHeader: { title: "Review " + locDetail.name },
    error: req.query.err
  });
};   
    
// Get Add Review //
module.exports.addReview = function(req, res){
    getLocationInfo(req, res, function(req, res, responseData){
        renderReviewForm(req, res, responseData);
    });
};
    
module.exports.doAddReview = function(req, res){
  var requestOptions, path, locationid, postdata;
  locationid = req.params.locationid;
  path = "/api/locations/" + locationid + "/reviews";
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect("/location/" + locationid + "/reviews/new?err=val");
  } else {
    request(requestOptions, function(err, response, body) {
        if (response.statusCode === 201) {
          res.redirect("/location/" + locationid);
        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
          res.redirect("/location/" + locationid + "/reviews/new?err=val");
        } else {
          console.log(body);
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};

