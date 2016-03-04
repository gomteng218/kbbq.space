angular.module("kbbqApp", []);

var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function() {
    return function (distance){
        var numDistance, unit;
        // ensuring a number as a parameter
      if (distance && _isNumeric(distance)) {
          // If distance is more than 1 mile, round to one decimal place and add mi unit. 1 mi = 1609.444m
          // 300ft = 152.4m
        if (distance > 152.4) {
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
};

var geolocation = function() {
    var getPosition = function(cbSuccess, cbError, cbNoGeo){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        } // If geolocation is not supported invoke not supported callback
        else {
            cbNoGeo();
        }
    };
    return {
        getPosition: getPosition
    };
};



var locationListCtrl = function($scope, kbbqData, geolocation) {
    $scope.message = "Checking your current location";
    $scope.getData = function(position){
        var lat = position.coords.latitude,
            lng = position.coords.longitude;
        $scope.message = "Searching for nearby locations";
        kbbqData.locationByCoords(lat, lng)
    kbbqData
        .success(function(data){
            $scope.message = data.length > 0 ? "": "No Nearby Locations Found";
            $scope.data = { locations: data };
    })
        .error(function (err){
            $scope.message = "Sorry, something is not right";
            console.log(err);
    });
    };
    
    $scope.showError = function(error){
        $scope.$apply(function(){
            $scope.message = error.message;
        });
    };
    
    $scope.noGeo = function() {
        $scope.$apply(function() {
            $scope.message = "Your browser does not support Geolocation service!";
        });
    };
    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};


var ratingStars = function() {
    return{
        scope: {
            thisRating: "=rating"
        },
        templateUrl: "/angular/rating-stars.html"
    };
};

var kbbqData = function($http) {
    var locationByCoords = function(lat, lng) { // 30 miles into meters is 48280.3 m
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=48280.3');
    };
    return {
        locationByCoords: locationByCoords
    };
};

angular
    .module("kbbqApp")
    .controller("locationListCtrl", locationListCtrl)
    .filter("formatDistance", formatDistance)
    .directive("ratingStars", ratingStars)
    .service("kbbqData", kbbqData)
    .service("geolocation", geolocation);