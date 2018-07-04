//variables
let markers = [], myPositionMarker, foodMarker, circle, center, radius, map;

//inititate google Maps and google Places
function initMap() {
  map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 15
  });

  //basic settings with user location
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

      //restaurants icon
      image = {
        url: 'ressources/restaurant.png',
      };

      //Google Places API call: find restaurants within specific radius (obtain Places Ids with nearBy() method then use getDetails() method)
      callPlacesApi();

      //get infos about restaurants then display on map
      data.forEach((element) => {
        displayRestaurantsMap(element);
      });

      //change search radius when zoom changes
      google.maps.event.addListener(map, 'zoom_changed', callPlacesApi);

      //change search radius when zoom changes
      google.maps.event.addListener(map, 'dragend', callPlacesApi);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}


//functions
function callPlacesApi() {
  removeMarkers();
  data = [];
  getRadius();
  let request = {
    location: center,
    radius: radius,
    type: ['restaurant']
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback1);
}

//callback from Google Places API calls
function callback1(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
  // You seem to have a pool of 9 or 10 requests to exhaust,
  // then you get another request every second therein.
  (function (i) {
    setTimeout(function () {
      let request = {
        placeId: results[i]['place_id']
        }
      service.getDetails(request, callback2);
    }, i < 9 ? 100 : 200 * i);
    })(i);
  }
}
}

function callback2(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // list.innerHTML = '';
    displayRestaurantsMap(place);
    resetRestaurantList();
    data.push(place);
  }
}

//functions
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
    } else {
      openingStatus = 'FERME';
    }
  } else {
    openingStatus = undefined;
  }
}

function getRadius() {
  if(circle !== undefined) {
    circle.setMap(null);
  }
  //get radius of viewable map
  var bounds = map.getBounds();
  center = map.getCenter();
  if (bounds && center) {
    var ne = bounds.getNorthEast();
    // Calculate radius (in meters).
    radius = google.maps.geometry.spherical.computeDistanceBetween(center, ne);
    radius = radius * 0.6;
  }
  circle = new google.maps.Circle({
  map: map,
  radius: radius,
  fillColor: '#f2eded',
  strokeColor: '#31ac3d',
  strokeOpacity: 0.9,
  strokeWeight: 0.5,
  center: center
});

//click on restaurant search zone : add a new restaurant
google.maps.event.addListener(circle, 'click', function(event) {
  openInputWindow();
  newPosition = event.latLng
});
}
