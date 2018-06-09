let map, myPosition, infoWindow, image, contentString, newPosition, service;

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
        url: 'ressources/restaurant.png',
      };

      //get infos about restaurants then display on map
      data.forEach((element) => {
        displayRestaurantsMap(element);
      });


      //click event on the map : add a new restaurant
      google.maps.event.addListener(map, 'click', function(event) {
        openInputWindow();
        newPosition = {
          "lat": event.latLng.lat(),
          "long": event.latLng.lng(),
        }
      });

      //Places API method. find nearBy restaurants (get restaurant IDs)
      var request = {
        location: myPosition,
        radius: '800',
        type: ['restaurant']
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}



//functions
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];

      var request = {
        placeId: results[i]['place_id']
      }
      //Places API method. to get detailed data (including reviews)
      service = new google.maps.places.PlacesService(map);
      service.getDetails(request, callback);

      function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          getPositionPlacesData(place);
          displayRestaurantsMap(place);
          displayRestaurantsList(place);
        }
      }
    }
  }
}

function displayRestaurantsMap(element) {
    let restaurant = element;
    let foodMarker = new google.maps.Marker({
      position: restaurant.geometry.location,
      map: map,
      icon: image,
    });

    markers.push(foodMarker);
    getAverageRating(restaurant);
    getCommentsList(restaurant);
    createInfosWindows(restaurant);

    foodMarker.info = new google.maps.InfoWindow({
      content: contentString
    });

    //display restaurant informations when marker clicked
    google.maps.event.addListener(foodMarker, 'click', function () {
      this.info.open(map, this);
    });

}

function createInfosWindows(restaurant) {
  contentString = '<div class="infosMap">' + '<h3>' + restaurant.name + '</h3>' + '<p>' + '<span>' +'Moyenne des avis: ' + '</span>' + averageRatings + '<i class="fas fa-star"></i>'
  + '</p>' + '<p>' + '<span>' +'Adresse: ' + '</span>' + restaurant.formatted_address +
  '</p>' + '<p>' + '<span>' +'Numéro de téléphone: ' + '</span>' + restaurant.formatted_phone_number + '</p>';

   // '<img src="https://maps.googleapis.com/maps/api/streetview?size=200x150&location='+restaurant.lat+','+restaurant.long+'&heading=151.78&pitch=-0.76'+
   // '&key=AIzaSyB7_0Zol2YjzYkQEXqK1QBOfXYkF9-RZds"></img>';

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
