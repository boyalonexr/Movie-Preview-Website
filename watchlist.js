const mainContainer = document.getElementById("main-container");
const emptyText = document.getElementById("empty-text");

function renderSavedMovies() {
  mainContainer.style.flexDirection = "column";
  emptyText.style.display = "none";

  const savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];

  // Clear previous movie content
  mainContainer.innerHTML = "";

  if (savedMovies.length === 0) {
    emptyText.style.display = "block";  // Show empty text if no saved movies
  }

  savedMovies.forEach((movie) => {
    // Render movie HTML content
    const movieContents = `
      <div class="movie-container">
        <section class="section-container">
          <div class="img-div">
            <img src="${movie.Poster}" alt="Poster for ${movie.Title}">
          </div>

          <div class="section-contents">
            <div class="section-one">
              <h2>${movie.Title}</h2>
              <i class="fa-solid fa-star"></i>
              <p>${movie.Ratings}</p>
            </div>

            <div class="section-two">
              <h3>${movie.Runtime}</h3>
              <h3 class="genre">${movie.Genre}</h3>
              <div>
                <button id="${movie.MovieId}" class="section-btn">
                  <i class="fa-solid fa-ban"></i>
                  <span>Remove</span>
                </button>
              </div>
            </div>

            <div class="section-three">
              <p class="plot-text">${movie.Plot}</p>
            </div>
          </div>
        </section>
      </div>
    `;

    // Append the movie content to the main container
    mainContainer.innerHTML += movieContents;
  });

  // Add event listeners to all "Remove" buttons after rendering movies
  const removeButtons = document.querySelectorAll('.section-btn');
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = button.id;

      // Remove the movie from savedMovies array
      let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
      savedMovies = savedMovies.filter(movie => movie.MovieId !== movieId);

      // Update localStorage
      localStorage.setItem('savedMovies', JSON.stringify(savedMovies));

      // Re-render the saved movies to reflect the change
      renderSavedMovies();
    });
  });
}

// Call the function to render movies when the page loads
renderSavedMovies();
