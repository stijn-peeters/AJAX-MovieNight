const basicMovieData = [];
const basicRyverMessage = [];
let pageNumData = 0;
let pageNumItem = 0;

function pageDetection() {
  if (`${window.location.href}`.includes('movies2')) {
    pageNumData = 24;
    pageNumItem = 6;
  }
}

function overviewText(overviewSlice, number) {
  if (`${window.location.href}`.includes('index.html')) {
    overview = `${overviewSlice[number].slice(0, 90)}...`;
  } else {
    overview = overviewSlice[number];
  }
}

function arrMovieData(array) {
  array.map((movie) => {
    let movieImgSrc = `${movie.poster_path}`;
    if (`${window.location.href}`.includes('movies') || `${window.location.href}`.includes('schedule')) {
      movieImgSrc = `${movie.backdrop_path}`;
    }
    if (`${window.location.href}`.includes('schedule')) {
      movieImgSize = 'original';
    } else {
      movieImgSize = 'w500';
    }
    basicMovieData.push(`https://image.tmdb.org/t/p/${movieImgSize}${movieImgSrc}`, movie.release_date, movie.original_title, movie.overview);
  });
}

function movieImg(array) {
  let j = pageNumData;
  for (let i = pageNumItem; i <= 19; i++) {
    document.querySelector(`.img${i}`).src = array[j];
    document.querySelector(`.release${i}`).textContent = array[j + 1];
    document.querySelector(`.title${i}`).textContent = array[j + 2];
    overviewText(array, (j + 3));
    document.querySelector(`.overview${i}`).textContent = overview;
    j += 4;
  }
}


function postMessageToRyver(message) {
  fetch('https://becode.ryver.com/api/1/odata.svc/workrooms%281320328%29/Chat.PostMessage%28%29', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '{PRIVATE API KEY}',
    },
    body: (JSON.stringify({
      createSource: {
        avatar: 'https://cdn2.iconfinder.com/data/icons/creative-icons-2/64/ACTION-512.png',
        displayName: 'Movie Announcer',
      },
      body: message,
    })),
  });
}


function scheduleImgChange() {
  document.querySelector('.testselect').addEventListener('click', () => {
    const selectedOption = document.querySelector('.testselect').selectedIndex - 1;
    if (selectedOption >= 0) {
      const selectedOptionArray = selectedOption * 4;
      document.querySelector('.test').src = basicMovieData[selectedOptionArray];
    }
  });
}

function schedulePostRyver() {
  document.querySelector('.postRyver').addEventListener('click', () => {
    const selectedOption = document.querySelector('.testselect').selectedIndex - 1;
    const ryverName = document.querySelector('.nameField').value;
    const ryverMessage = document.querySelector('.messageField').value;
    if (selectedOption >= 0) {
      const selectedOptionArray = selectedOption * 4;
      const ryverMovie = basicMovieData[selectedOptionArray + 2];
      basicRyverMessage.push(`${ryverName} has an eye on ${ryverMovie}: ${ryverMessage}`);
      postMessageToRyver(basicRyverMessage[0]);
    }
  });
}

function scheduleInfo(array) {
  if (`${window.location.href}`.includes('schedule')) {
    scheduleImgChange();
    schedulePostRyver();
    let j = 0;
    for (let i = 0; i <= 12; i++) {
      document.querySelector(`.title${i}`).textContent = array[j + 2];
      j += 4;
    }
  }
}


fetch('https://api.themoviedb.org/3/discover/movie?api_key={PRIVATE API KEY}&region=Ghent,be&sort_by=popularity.desc&release_date.gte=2019-10-01')
  .then((response) => {
    const data = response.json();
    return data;
  })
  .then((response) => {
    const { results } = response;
    pageDetection();
    arrMovieData(results);
    scheduleInfo(basicMovieData);
    movieImg(basicMovieData);
  });
