let markers = [];

//inititate google Maps and google Places
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
      let marker = new google.maps.Marker({
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
          "lng": event.latLng.lng(),
        }
      });

      //Places API method: find nearBy restaurants (via restaurant IDs)
      let request = {
        location: myPosition,
        radius: '1000',
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


//callback from places
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      let place = results[i];

      let request = {
        placeId: results[i]['place_id']
      }
      //Places API method: get more detailed data (including reviews)
      service = new google.maps.places.PlacesService(map);
      service.getDetails(request, callback);

      function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          // getPositions(place);
          displayRestaurantsMap(place);
          displayRestaurantsList(place);
          data.push(place);
        }
      }
    }
  }
}

function resetRestaurantMap() {
  removeMarkers();
  data.forEach((restaurant) => displayRestaurantsMap(restaurant));
}

function displayRestaurantsMap(place) {
    getAverageRating(place);
    getCommentsList(place);
  if(averageRatings >= filter1.value && averageRatings <= filter2.value || averageRatings == '') {
    getPositions(place);
    let foodMarker = new google.maps.Marker({
      position: {lat: lat, lng: lng},
      map: map,
      icon: image,
    });
    markers.push(foodMarker);
    createInfosWindows(place);
    foodMarker.info = new google.maps.InfoWindow({
      content: contentString
    });
    //display restaurant informations when marker clicked
    google.maps.event.addListener(foodMarker, 'click', function () {
      this.info.open(map, this);
    });
  }
}

function createInfosWindows(restaurant) {
 checkOpeningStatus(restaurant);
  contentString = '<div class="infosMap">' + '<h3>' + restaurant.name + '</h3>' +
 '<img class="map-image" src="https://maps.googleapis.com/maps/api/streetview?size=220x100&location='+lat+','+lng+'&heading=151.78&pitch=-0.76&key=AIzaSyB7_0Zol2YjzYkQEXqK1QBOfXYkF9-RZds"></img>'
  + '<p>' + '<span>' +'Moyenne des avis: ' + '</span>' + averageRatings + '<i class="fas fa-star"></i>'
  + '</p>' + '<p>' + '<span>' +'Adresse: ' + '</span>' + restaurant.formatted_address +
  '</p>';

  if(restaurant.formatted_phone_number != undefined) {
    contentString += '<p>' + '<span>' +'Numéro de téléphone: ' + '</span>' + restaurant.formatted_phone_number + '</p>';
  }

  if(openingStatus != undefined) {
    contentString += '<p>' + '<span>' +'Status actuel: ' + '</span>' + '<span class=' + '"' + openingStatus + '"' + '>' + openingStatus + '</span>' + '</p>';
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  function removeMarkers() {
    for(i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }
    markers = [];
}

function placeMarker(location) {
  foodMarker = new google.maps.Marker({
    position: {lat: location.lat, lng:location.lng},
    map: map,
    icon: image
  });
}

function checkOpeningStatus(place) {
  if ('opening_hours' in place) {
    if(place.opening_hours.open_now) {
      openingStatus = 'OUVERT';
      // openingStatus.style.color = "#4bba50";
    } else {
      openingStatus = 'FERME';
      // openingStatus.style.color = "red";
    }
  }
}



// let map, myPosition, infoWindow, image, contentString, newPosition, service;
