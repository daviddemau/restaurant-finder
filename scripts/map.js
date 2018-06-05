var map, infoWindow, image;

function initMap() {
  map = new google.maps.Map(document.querySelector('.map'), {
    center: {lat: 48.8566, lng: 2.3522},
    zoom: 15
  });
  //get our current location (latitude and longitude)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      //center the map on user location
      map.setCenter(pos);

      //marker displaying user location
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
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
      displayMapRestaurants();

      //create a new marker when map is clicked
      google.maps.event.addListener(map, 'click', function(event) {
        document.querySelector('.main').style.filter = 'blur(7px)';
        newRestaurantForm.style.display = 'block';
        list.innerHTML += '<li class="name">' + restaurant.restaurantName + '<span class="stars">' + averageRatings + '</span>' + '<i class="fas fa-star"></i>'+ '</li>' + '<li class="review">' + '<img src="https://maps.googleapis.com/maps/api/streetview?size=300x200&location='+restaurant.lat+','+restaurant.long+'&heading=151.78&pitch=-0.76&key=AIzaSyB7_0Zol2YjzYkQEXqK1QBOfXYkF9-RZds"></img>' + '<h3>Les avis sur cette maison:</h3>' + '<div class="comments">' + commentsList.join('') + '</div>' + '<button class="commentButton">Ajouter un commentaire</button>' + '<input class="commentInput" type="text" placeholder="votre commentaire ici"></input>';
      });

      function placeMarker(location) {
        var newMarker = new google.maps.Marker({
          position: location,
          map: map,
          icon: image
        });
      }

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}


function displayMapRestaurants() {
  for (var i = 0; i < data.length; i++) {
    var restaurant = data[i];
    var foodMarker = new google.maps.Marker({
      position: {lat: restaurant.lat, lng: restaurant.long},
      map: map,
      icon: image,
    });

    getRatings(restaurant);
    getComments(restaurant);

    var contentString = '<div class="infosMap">' + '<h3>' + restaurant.restaurantName + '<span>' + averageRatings + '</span>' + '<i class="fas fa-star"></i>'+ '</h3>' + '<img src="https://maps.googleapis.com/maps/api/streetview?size=300x100&location='+restaurant.lat+','+restaurant.long+'&heading=151.78&pitch=-0.76&key=AIzaSyB7_0Zol2YjzYkQEXqK1QBOfXYkF9-RZds"></img>' + '<p class="mapReview">Les avis sur cette maison:</p>' + '<div class="mapComments">' +  commentsList.join('') + '</div>' + '</div>';

    foodMarker.info = new google.maps.InfoWindow({
      content: contentString,
    });

    //display restaurant informations when marker clicked
    google.maps.event.addListener(foodMarker, 'click', function () {
      this.info.open(map, this);
    });
  }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
