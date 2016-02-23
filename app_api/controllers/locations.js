var mongoose = require("mongoose");
var Place = mongoose.model("Location");

var sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

// geoNear now outputs in meters, not in radians so no longer needed

/*var ourPlanet = (function(){
    var earthRadius = 6371; // in miles 3959
    // Convert radians to distance
    var getDistanceFromRads = function(rads){
        return parseFloat(rads * earthRadius);
    };
    // Function to convert distance to radians
    var getRadsFromDistance = function(distance){
        return parseFloat(distance / earthRadius);
    };
    return{
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
})();*/



// SHOW LOCATIONS BY DISTANCE
module.exports.locationsListByDistance = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseFloat(req.query.maxDistance);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: maxDistance,
        num: 10
    };
        if ((!lng && lng!==0) || (!lat && lat!==0) || ! maxDistance) {
            console.log("locationsListByDistance missing param");
            sendJSONResponse(res, 404, {
              "message": "lng, lat and maxDistance query parameters are all required"
            });
            return;
        }
    Place.geoNear(point, geoOptions, function(err, results, stats){
        var locations;
            console.log('Geo Results', results);
            console.log('Geo stats', stats);
        if (err) {  
              console.log('geoNear error:', err);
              sendJSONResponse(res, 404, err);
        } else {
              locations = buildLocationList(req, res, results, stats);
              sendJSONResponse(res, 200, locations);
        }
    });
};

var buildLocationList = function(req, res, results, stats) {
  var locations = [];
  results.forEach(function(doc) {
    locations.push({
      distance: doc.dis,
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      features: doc.obj.features,
      _id: doc.obj._id
    });
  });
  return locations;
};

// READ LOCATION
module.exports.locationsReadOne = function(req, res) {
    if(req.params && req.params.locationid){
        Place.findById(req.params.locationid).exec(function(err, location) {
            if(!location){
                sendJSONResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if(err) {
                sendJSONResponse(res, 404, err);
                return;
            }
            sendJSONResponse(res, 200, location);
        });
    } else {
        sendJSONResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};


// CREATE NEW LOCATION
module.exports.locationsCreate = function(req, res) {
  Place.create({
    name: req.body.name,
    address: req.body.address,
    features: req.body.features.split(","),
      // Parse coordinates from strings to numbers
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    } , {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    } , {
      days: req.body.days3,
      opening: req.body.opening3,
      closing: req.body.closing3,
      closed: req.body.closed3,
    }]
  }, function(err, location) {
    if (err) {
      console.log(err);
      sendJSONResponse(res, 400, err);
    } else {
      console.log(location);
      sendJSONResponse(res, 201, location);
    }
  });
};


// UPDATE LOCATION
module.exports.locationsUpdateOne = function(req, res) {
  if (!req.params.locationid) {
    sendJSONResponse(res, 404, {
      "message": "Not found, locationid is required"
    });
    return;
  }
    // Find location doc by given ID
  Place.findById(req.params.locationid).select('-reviews -rating').exec(function(err, location) {
        if (!location) {
          sendJSONResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          sendJSONResponse(res, 400, err);
          return;
        }
      // Update paths with submitted form
        location.name = req.body.name;
        location.address = req.body.address;
        location.features = req.body.features.split(",");
        location.coords = [
            parseFloat(req.body.lng), 
            parseFloat(req.body.lat)
        ];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1,
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2,
        }, {
          days: req.body.days3,
          opening: req.body.opening3,
          closing: req.body.closing3,
          closed: req.body.closed3,
        }];
      // save
        location.save(function(err, location) {
          if (err) {
            sendJSONResponse(res, 404, err);
          } else {
            sendJSONResponse(res, 200, location);
          }
        });
      }
  );
};

// DELETE LOCATION
module.exports.locationsDeleteOne = function(req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    Place.findByIdAndRemove(locationid).exec(function(err, location) {
          if (err) {
            console.log(err);
            sendJSONResponse(res, 404, err);
            return;
          }
          sendJSONResponse(res, 204, null);
        }
    );
  } else {
    sendJSONResponse(res, 404, {
      "message": "Cannot find locationid"
    });
  }
};