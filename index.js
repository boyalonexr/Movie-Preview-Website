const input = document.getElementById("input");
const searchBtn = document.getElementById("search-btn");
const mainContainer = document.getElementById("main-container");
const apikey = "9e5d9c14";

let moviesArr = [];
let moviesArr2 = []

// localStorage.clear()

function generateMovies() {
  const searchQuery = input.value.trim();
  const url = `http://www.omdbapi.com/?apikey=${apikey}&s=${searchQuery}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      moviesArr = [];
      if (data.Search) {
        data.Search.map((movies) => {
          const moviesData = {
            Title: movies.Title,
            Year: movies.Year,
            MovieId: movies.imdbID,
            Poster: movies.Poster,
          };

          moviesArr.push(moviesData);
        });
        moviesDetails();
      } else if (input.value === "") {
        alert("Enter a Movie");
      } else if (!data.Search) {
        mainContainer.innerHTML = `
       <div class="empty-text">
        <p>Unable to find what you are looking for. Please try another search.</p>
      </div>
      `;
      }
      // input.value = "";
    });
}

searchBtn.addEventListener("click", generateMovies);

function moviesDetails() {
  mainContainer.innerHTML = "";
  mainContainer.style.flexDirection = "column";

  // Loop through the movies array
  moviesArr.forEach((movies) => {
    const url = `http://www.omdbapi.com/?apikey=${apikey}&i=${movies.MovieId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        renderMovies(data);
        moviesArr2.push(data)
        input.value = "";
      });
  });
}

function renderMovies(movies) {
  let movieContents = `
    <div class="movie-container">
      <section class="section-container">
        <div class="img-div">
          <img src="${movies.Poster}" alt="">
        </div>

        <div class="section-contents">
          <div class="section-one">
            <h2>${movies.Title}</h2>
            <i class="fa-solid fa-star"></i>
            <p>${movies.Ratings[0] ? movies.Ratings[0].Value : 'N/A'}</p>
          </div>

          <div class="section-two">
            <h3>${movies.Runtime}</h3>
            <h3 class="genre">${movies.Genre}</h3>
            <div>
              <button id=${movies.imdbID} class="section-btn">
                <i class="fa-solid fa-circle-plus"></i>
                <span>Watchlist</span>
              </button>
            </div>
          </div>

          <div class="section-three">
            <p class="plot-text">${movies.Plot}</p>
          </div>
        </div>
      </section>
    </div>
  `;
  mainContainer.innerHTML += movieContents;

  // Add event listener for the "Watchlist" button
  const addBtn = document.querySelectorAll(".section-btn");

  addBtn.forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = button.id; 
      const movie = moviesArr2.find((movie) => movie.imdbID === movieId);


      const movieData = {
        Title: movie.Title,
        Year: movie.Year,
        MovieId: movie.imdbID,
        Poster: movie.Poster,
        Plot: movie.Plot,
        Runtime: movie.Runtime,
        Genre: movie.Genre,
        Ratings: movie.Ratings && movie.Ratings[0] ? movie.Ratings[0].Value : 'N/A'
      };


      let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

      // Check if the movie is already in the savedMovies array
      const isMovieAlreadySaved = savedMovies.some(savedMovie => savedMovie.MovieId === movieData.MovieId);
      if (isMovieAlreadySaved) {
        alert("This movie is already in your Watchlist!");
      } else {
        // Add the new movie to savedMovies array
        savedMovies.unshift(movieData);
        
        // Save the updated list back to localStorage
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
  
      
      button.innerHTML = `<i class="fa-solid fa-circle-check" style="color: green;"></i> Added!`;
    }
  });
})
}