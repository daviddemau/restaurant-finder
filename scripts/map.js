let markers = [];
let myPositionMarker;
let foodMarker;

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
      myPositionMarker = new google.maps.Marker({
        position: myPosition,
        map: map,
      });

      myPositionMarker.info = new google.maps.InfoWindow({
        content: "Votre position actuelle",
      });

      google.maps.event.addListener(myPositionMarker, 'click', function () {
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

      //right-click event: search for new restaurant informations based on click location. Look for restaurants anywhere on the map for better user experience.
      google.maps.event.addListener(map, 'rightclick', function(event) {
        data = [];
        map.setCenter(event.latLng);
        let request = {
          location: event.latLng,
          radius: '1000',
          type: ['restaurant']
        };
        myPositionMarker.setMap(null);
        removeMarkers();
        myPositionMarker = new google.maps.Marker({
          position: event.latLng,
          map: map,
        });
        myPositionMarker.info = new google.maps.InfoWindow({
          content: "Votre position actuelle",
        });
        myPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        data = [];
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
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
          list.innerHTML = '';
          displayRestaurantsMap(place);
          resetRestaurantList();
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
    foodMarker = new google.maps.Marker({
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
