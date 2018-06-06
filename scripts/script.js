//variables
let list = document.querySelector('.list');
let data = restaurants_list;
let averageRatings;
let commentsList;
let closingTag = document.querySelector('.fa-times');

//select filter elements
let filter1 = document.querySelector('.filter1');
let filter2 = document.querySelector('.filter2');
let filterButton = document.querySelector('.submit');

//target elements when map is clicked
let newRestaurantForm = document.querySelector('.newRestaurantForm');
let newName = document.querySelector('.nameNewRestaurant');
let newComment = document.querySelector('.commentNewRestaurant');
let newRating = document.querySelector('.newRestaurantRating');
let newRestaurantSubmit = document.querySelector('.newRestaurantSubmit');
let closeInput = document.querySelector('.fa-times');


//add a new restaurant on right column when form submitted
newRestaurantSubmit.addEventListener('click', () => {
  addRestaurantsRightColumn(newName.value, newComment.value, newRating.value, newPos.lat, newPos.long);
  addListeners();
  //add listeners on map to get infos on new restaurant added
  displayInfosOnMap(newName.value, newRating.value, newPos.lat, newPos.lng);
  addInfoWindows(newMarker);
  closeInputWindow();
})

//close newInput when close icon clicked
closeInput.addEventListener('click', closeInputWindow);

//filter the restaurants List
filterButton.addEventListener('click', displayRestaurantsList);

//call default restaurant list on screen (ratings between 1 and 5 by default)
displayRestaurantsList();

//functions
function displayRestaurantsList() {
  list.innerHTML = '';
  data.forEach((restaurant) => {

    getRatings(restaurant);
    getComments(restaurant);

    if(averageRatings >= filter1.value && averageRatings <= filter2.value) {
      //display elements on screen
      addRestaurantsRightColumn(restaurant.restaurantName, commentsList.join(''), averageRatings, restaurant.lat, restaurant.long);
    }
  })
  //add click listeners
  addListeners();
}

function getRatings(place) {
  //get average ratings for all places
  averageRatings = place.ratings.reduce((a, b) => {
    return (a.stars + b.stars) / place.ratings.length;
  })
}

function getComments(place) {
  commentsList = place.ratings.map((e) => '<p class="comment">' + '=>  ' + e.comment + '</p>');
}

function toggleShow(e) {
  e.addEventListener('click', () => {
    if(e.nextSibling.style.display == '') {
      e.nextSibling.style.display = 'block';
    } else {
      e.nextSibling.style.display = '';
    }
  })
}

function addComment (e) {
  e.addEventListener('keypress', (event) => {
    var commentsList = e.parentElement.getElementsByClassName("comments")[0];

    if(event.keyCode == 13) {
      commentsList.innerHTML += '<p class="comment">' + '=>  ' + e.value + '</p>'
      e.value = '';
    }
  })
}

function addListeners () {
  //show or hide restaurant comments on click
  let restaurantNames = document.querySelectorAll('.name');
  Array.from(restaurantNames).forEach(toggleShow);

  //show or hide add new comment input
  let addCommentButtons = document.querySelectorAll('.commentButton');
  Array.from(addCommentButtons).forEach(toggleShow);

  //add comment from input
  let commentInput = document.querySelectorAll('.commentInput');
  Array.from(commentInput).forEach(addComment);
}

function addRestaurantsRightColumn(name, comments, ratings, lat, lgn) {
  list.innerHTML += '<li class="name">' + name + '<span class="stars">' + ratings + '</span>' + '<i class="fas fa-star"></i>'+ '</li>' + '<li class="review">' + '<img src="https://maps.googleapis.com/maps/api/streetview?size=300x200&location='+lat+','+lgn+'&heading=151.78&pitch=-0.76&key=AIzaSyB7_0Zol2YjzYkQEXqK1QBOfXYkF9-RZds"></img>' + '<h3>Les avis sur cette maison:</h3>' + '<div class="comments">' + comments + '</div>' + '<button class="commentButton">Ajouter un commentaire</button>' + '<input class="commentInput" type="text" placeholder="votre commentaire ici"></input>';
}

function closeInputWindow() {
  document.querySelector('.main').style.filter = 'none';
  newRestaurantForm.style.display = 'none';
}

function openInputWindow() {
  document.querySelector('.main').style.filter = 'blur(10px)';
  newRestaurantForm.style.display = 'block';
}
