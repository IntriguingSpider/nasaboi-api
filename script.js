const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const count = 2;
const apiKey = 'FMXMWnaogIWGZR6McSmFEL909vAYqbJMmrsiSHfk';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

const showContent = function (page) {
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
  loader.classList.add('hidden');
};

const createDOMNodes = function (page) {
  let currentArray =
    page === 'results' ? resultsArray : Object.values(favorites);
  //   currentArray = resultsArray;
  currentArray.forEach((result) => {
    //CardContainer
    const card = document.createElement('div');
    card.classList.add('card');
    // Link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    //Image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    //Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    //Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    //Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.textContent = 'Add to Favorites';
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favorite';
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }
    //Card Text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;
    //Footer Container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    //Date
    const date = document.createElement('strong');
    date.textContent = result.date;
    //Copyright
    const copyright = document.createElement('span');
    copyright.textContent = ` ${result.copyright ? result.copyright : ''}`;
    //Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
};

const updateDOM = function (page) {
  if (localStorage.getItem('NasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('NasaFavorites'));
    console.log(favorites);
  }
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
};

//Get 10 images from NASA API
async function getNasaPictures() {
  //Show Loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM('results');
  } catch (error) {
    //Catch Error Here
    console.log(error);
  }
}
//Add Result to Favorites
const saveFavorite = function (itemUrl) {
  //Loop through results array to select favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      //Show Save Confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      localStorage.setItem('NasaFavorites', JSON.stringify(favorites));
    }
  });
  console.log(favorites);
};

//Remove item from favorites
const removeFavorite = function (itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem('NasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
};
//On Load
getNasaPictures();

//Change the 'Save to Favorites Text' into Remove favorites if it is already in the favorites
//Add functionality to remove a favorite from local storage
