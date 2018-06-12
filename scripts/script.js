// clone data array to new none -- store this new array on session storage object -- when any changes : comment, new restaurant => cloned array get all changes, then we call the "classic" display functions (on the right column and on the map)
let data = restaurants_list.slice();

//variables
let list = document.querySelector('.list');
let averageRatings;
let commentsList;
let closingTag = document.querySelector('.fa-times');

//elements that will receive click listeners
let restaurantNames = document.querySelectorAll('.name');
let addCommentButtons = document.querySelectorAll('.commentButton');
let commentInput = document.querySelectorAll('.commentInput');


//filter elements (choose between X and Y stars)
let filter1 = document.querySelector('.filter1');
let filter2 = document.querySelector('.filter2');
let filterButton = document.querySelector('.submit');

//new restaurant form elements
let newRestaurantForm = document.querySelector('.newRestaurantForm');
let newName = document.querySelector('.newName');
let newAdress = document.querySelector('.newAdress');
let newPhone = document.querySelector('.newPhone');
let newComment = document.querySelector('.newComment');
let newRating = document.querySelector('.newRating');
let newRestaurantSubmit = document.querySelector('.newRestaurantSubmit');
let closeInput = document.querySelector('.fa-times');

//call default restaurant list on screen (ratings between 1 and 5 by default)
resetRestaurantList();

//add a new restaurant when submit button is cliqued
newRestaurantSubmit.addEventListener('click', addNewRestaurant);

//close add restaurant input on close tag
closeInput.addEventListener('click', closeInputWindow);

//filter restaurants between X and Y average rating values
filterButton.addEventListener('click', () => {
  resetRestaurantList();
  resetRestaurantMap();
});

//functions
function resetRestaurantList() {
  list.innerHTML = '';
  data.forEach((restaurant) => displayRestaurantsList(restaurant));
}

function displayRestaurantsList(place) {
  getPositions(place);
  getAverageRating(place);
  getCommentsList(place);
  //make sure rating for this restaurant is between filters values on top of the list
  if(averageRatings >= filter1.value && averageRatings <= filter2.value || averageRatings == '') {
    //display elements on screen
    addRestaurantsRightColumn(place);
  }
  addListeners ();
}

function addRestaurantsRightColumn(place) {
  list.innerHTML += '<li class="name">' + '<span>' + place.name + '</span>' + '<span class="stars">' + averageRatings + '</span>' +
  '<i class="fas fa-star"></i>'+ '</li>' + '<li class="review">' +
  '<img src="https://maps.googleapis.com/maps/api/streetview?size=300x200&location='+lat+','+lng+'&heading=151.78&pitch=-0.76&key=AIzaSyB7_0Zol2YjzYkQEXqK1QBOfXYkF9-RZds"></img>' +
  '<h3>Les avis sur cette maison:</h3>' +
  '<div class="comments">' + commentsList + '</div>' +
  '<button class="commentButton">Ajouter un commentaire</button>' +
  '<div class="addCommentZone">' +
  '<label>' + 'Note sur 5' + '</label>' +
  '<select class="newRating"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>' +
  '<input class="newRestaurantInput newComment" type="text" placeholder="votre commentaire.." required>' +
  '</div>'
}

function getAverageRating(place) {
  let allReviews = place.reviews;
  //get average ratings for all places
  if(allReviews != undefined) {
    if(allReviews.length > 1) {
      totalGrade = allReviews.reduce((a, b) => {
          return a + b.rating;
      }, 0)
      averageRatings = (totalGrade / allReviews.length);
    } else {
      averageRatings = allReviews[0].rating;
    }
  } else {
    averageRatings = '';
  }
}

function getCommentsList(place) {
  if(place.reviews != undefined) {
    commentsList = place.reviews.map((e) => {
      if(e.text != '') {
        return '<p class="comment">' + e.rating + '  =>  ' + e.text + '</p>';
      } else {
        return '<p class="comment">' + e.rating + '  =>  ' + '(Avis sans commentaire)' + '</p>';
      }
    })
  } else {
    commentsList = '<p class="comment">' + '=>  ' + 'Pas de commentaire disponible' + '</p>';
  }
}

function addNewRestaurant() {
  //create new food marker based on click event location
  placeMarker(newPosition);
  //create a new restaurant object on click, add it to memory (session storage/array)
  newRestaurant = {
     "name": newName.value,
     "formatted_address": newAdress.value,
     "formatted_phone_number": newPhone.value,
     "geometry":{
       "viewport":{
         "b":{"b":newPosition.lng},
         "f":{"f":newPosition.lat}
       },
     },
     "reviews":[
        {
           "rating": newRating.value,
           "text": newComment.value
        },
     ]
  };

  data.push(newRestaurant);
  resetRestaurantList();
  resetRestaurantMap();
  closeInputWindow();
}

function centerMap(element) {
  element.addEventListener('click', () => {
    let rank = Array.from(restaurantNames).indexOf(element);
    if(element.nextSibling.style.display == '') {
      //center the map around corresponding restaurant marker and open its info window
      map.panTo(markers[rank].position);
      markers[rank].info.open(map,markers[rank]);
      //show comments and add comment button
      element.nextSibling.style.display = 'block';
    } else {
      markers[rank].info.close(map,markers[rank]);
      map.panTo(myPosition);
      element.nextSibling.style.display = '';
    }
  })
}



function addListeners() {
  //show or hide comments on click AND center map around corresponding restaurant
  restaurantNames = document.querySelectorAll('.name');
  array = Array.from(restaurantNames);

  for(var i = 0; i < array.length; i++) {
   array[i].addEventListener('click', centerMap(array[i]));
  }
  //show or hide add new comment input
  addCommentButtons = document.querySelectorAll('.commentButton');
  Array.from(addCommentButtons).forEach(toggleShow);

  //add comment from input
  // commentInput = document.querySelectorAll('.newComment');
  // Array.from(commentInput).forEach(addComment);
}

function closeInputWindow() {
  document.querySelector('.main').style.filter = 'none';
  newRestaurantForm.style.display = 'none';
  newRestaurantForm.reset();
}

function openInputWindow() {
  document.querySelector('.main').style.filter = 'blur(10px)';
  newRestaurantForm.style.display = 'block';
}

function getPositions(element) {
  lng = element.geometry.viewport.b.b;
  lat = element.geometry.viewport.f.f;
}

function toggleShow(element) {
  element.addEventListener('click', () => {
    if(element.nextSibling.style.display == '') {
      element.nextSibling.style.display = 'block';
    } else {
      element.nextSibling.style.display = '';
    }
  })
}




// function addComment (element) {
//   element.addEventListener('keypress', (event) => {
//
//     if(event.keyCode == 13) {
//       let commentsList = element.closest("li").querySelector('.comments');
//       let parentDiv = element.closest("li").previousSibling;
//       let placeName = parentDiv.querySelector('span').innerHTML;
//       let commentRating = element.previousSibling;
//
//       let newCommentObject = {
//            "rating": Number(commentRating.value),
//            "text": element.value
//         },
//
//     //get restaurant name, then add new comment inside this restaurant object. finally reset lists
//      targetedRestaurant = data.find((restaurant) => {
//        return restaurant.name = placeName;
//      });
//      targetedRestaurant.reviews.push(newCommentObject);
//
//
//      //add new comment on screen
//     commentsList.innerHTML += '<p class="comment">' + '=>  ' + element.value + '</p>'
//     element.value = '';
//     element.closest("div").style.display = '';
//     //reset data
//     resetRestaurantList();
//     resetRestaurantMap();
//     }
//   })
// }
