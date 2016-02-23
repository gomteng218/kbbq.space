var mongoose = require("mongoose");
var Place = mongoose.model("Location");

var sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

// CREATE REVIEW
module.exports.reviewsCreate = function(req, res) {
  if (req.params.locationid) {
    Place.findById(req.params.locationid).select('reviews').exec(function(err, location) {
          if (err) {
            sendJSONResponse(res, 400, err);
          } else {
            doAddReview(req, res, location);
          }
        }
    );
  } else {
    sendJSONResponse(res, 404, {
      "message": "Not found, locationid required"
    });
  }
};

var doAddReview = function(req, res, location) {
  if (!location) {
    sendJSONResponse(res, 404, "locationid not found");
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location) {
      var currentReview;
      if (err) {
        console.log(err);
        sendJSONResponse(res, 400, err);
      } else {
        updateAverageRating(location._id);
        currentReview = location.reviews[location.reviews.length - 1];
        sendJSONResponse(res, 201, currentReview);
      }
    });
  }
};

var updateAverageRating = function(locationid) {
  Place.findById(locationid).select('reviews').exec(function(err, location) {
        if (!err) {
          doSetAverageRating(location);
        }
    });
};

var doSetAverageRating = function(location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
      // Loop review subdoc adding up ratings
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
      // Calculate average rating
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
      // Update rating of parent doc
    location.rating = ratingAverage;
      // Save parent doc
    location.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};



// UPDATE REVIEW
module.exports.reviewsUpdateOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJSONResponse(res, 404, {
        "message": "Not found, locationid and reviewid are both required"
    });
    return;
  }
    // Find parent doc
  Place.findById(req.params.locationid).select('reviews').exec(function(err, location) {
        var currentReview;
        if (!location) {
          sendJSONResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          sendJSONResponse(res, 400, err);
          return;
        }
        if (location.reviews && location.reviews.length > 0) {
          currentReview = location.reviews.id(req.params.reviewid);
          if (!currentReview) {
            sendJSONResponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
              // Make changes from form data
            currentReview.author = req.body.author;
            currentReview.rating = req.body.rating;
            currentReview.reviewText = req.body.reviewText;
            location.save(function(err, location) {
              if (err) {
                sendJSONResponse(res, 404, err);
              } else {
                updateAverageRating(location._id);
                sendJSONResponse(res, 200, currentReview);
              }
            });
          }
        } else {
          sendJSONResponse(res, 404, {
            "message": "No review to update"
          });
        }
      }
  );
};

// READ REVIEW
module.exports.reviewsReadOne = function(req, res) {
  if (req.params && req.params.locationid && req.params.reviewid) {
    Place.findById(req.params.locationid).select('name reviews').exec(function(err, location) {
          console.log(location);
          var response, review;
          if (!location) {
            sendJSONResponse(res, 404, {
              "message": "locationid not found"
            });
            return;
          } else if (err) {
            sendJSONResponse(res, 400, err);
            return;
          }
          if (location.reviews && location.reviews.length > 0) {
            review = location.reviews.id(req.params.reviewid);
            if (!review) {
              sendJSONResponse(res, 404, {
                "message": "reviewid not found"
              });
            } else {
              response = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              sendJSONResponse(res, 200, response);
            }
          } else {
            sendJSONResponse(res, 404, {
              "message": "No reviews found"
            });
          }
        }
    );
  } else {
    sendJSONResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
  }
};


// DESTROY REVIEW
module.exports.reviewsDeleteOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJSONResponse(res, 404, {
      "message": "Not found! locationid and reviewid are both required"
    });
    return;
  }
  Place.findById(req.params.locationid).select('reviews').exec(function(err, location) {
        if (!location) {
          sendJSONResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          sendJSONResponse(res, 400, err);
          return;
        }
        if (location.reviews && location.reviews.length > 0) {
          if (!location.reviews.id(req.params.reviewid)) {
            sendJSONResponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
            location.reviews.id(req.params.reviewid).remove();
            location.save(function(err) {
              if (err) {
                sendJSONResponse(res, 404, err);
              } else {
                updateAverageRating(location._id);
                sendJSONResponse(res, 204, null);
              }
            });
          }
        } else {
          sendJSONResponse(res, 404, {
            "message": "No review to delete"
          });
        }
      }
  );
};