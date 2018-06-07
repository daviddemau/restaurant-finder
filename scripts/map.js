let map, myPosition, infoWindow, image, contentString, newPosition;

let markers = [];

function initMap() {
  map = new google.maps.Map(document.querySelector('.map'), {
    center: {lat: 48.8566, lng: 2.3522},
    zoom: 15
  });

  //get our current location (latitude and longitude)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      //center the map on user location
      map.setCenter(myPosition);

      //marker displaying user location
      var marker = new google.maps.Marker({
        position: myPosition,
        map: map,
      });
      marker.info = new google.maps.InfoWindow({
        content: "Vous Êtes Ici",
      });
      google.maps.event.addListener(marker, 'click', function () {
        this.info.open(map, this);
      });

      //icon that represents a restaurant on the map
      image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
      };

      //get infos about restaurants then display on map
      displayRestaurantsMap();

      //click event on the map : add a new restaurant
      google.maps.event.addListener(map, 'click', function(event) {
        openInputWindow();
        newPosition = {
          "lat": event.latLng.lat(),
          "long": event.latLng.lng(),
        }
      });

      //when restaurant clicked on right list, center the map on this restaurant.

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

//functions

function displayRestaurantsMap() {
  markers = [];
  for (var i = 0; i < data.length; i++) {
    var restaurant = data[i];
    var foodMarker = new google.maps.Marker({
      position: {lat: restaurant.lat, lng: restaurant.long},
      map: map,
      icon: image,
    });
    markers.push(foodMarker);
    getRatings(restaurant);
    getComments(restaurant);
    createInfosWindows(restaurant);
    addMarkerListeners(foodMarker);
  }
}

function createInfosWindows(restaurant) {
  contentString = '<div class="infosMap">' + '<h3>' + restaurant.restaurantName+ '<span>' + averageRatings + '</span>' + '<i class="fas fa-star"></i>'+ '</h3>' + '<img src="https://maps.googleapis.com/maps/api/streetview?size=200x100&location='+restaurant.lat+','+restaurant.long+'&heading=151.78&pitch=-0.76&key=AIzaSyB7_0Zol2YjzYkQEXqK1QBOfXYkF9-RZds"></img>';
}


function addMarkerListeners(marker) {
  marker.info = new google.maps.InfoWindow({
    content: contentString,
  });
  //display restaurant informations when marker clicked
  google.maps.event.addListener(marker, 'click', function () {
    this.info.open(map, this);
  });
}

function placeMarker(location) {
  newMarker = new google.maps.Marker({
    position: location,
    map: map,
    icon: image
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
