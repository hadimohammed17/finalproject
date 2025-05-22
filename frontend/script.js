const apiKey = '71687fee99c471fead84b44849e2b6ad';
let genreList = [];

// load genres when page opens
document.addEventListener("DOMContentLoaded", async () => {
  const genreSelect = document.getElementById("genre-select");
  if (!genreSelect) return;

  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
  );
  const data = await response.json();
  genreList = data.genres;

  // add each genre to the dropdown
  genreList.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
});

// get movies from selected genre
async function getMovies() {
  const genreId = document.getElementById("genre-select").value;
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`
  );
  const data = await response.json();
  displayMovies(data.results);
}

// show movies in the results section
function displayMovies(movies) {
  const container = document.getElementById("movies-container");
  container.innerHTML = "";

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "feature-card";
    card.innerHTML = `
      <h3>${movie.title}</h3>
      <p>${movie.overview || "no description available."}</p>
      <button class="cta-button">❤️ Save</button>
    `;

    // add click to save movie
    card.querySelector("button").addEventListener("click", () => saveMovie(movie));
    container.appendChild(card);
  });
}

// save movie to backend
function saveMovie(movie) {
  fetch('http://localhost:3001/api/saved', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: movie.title,
      overview: movie.overview
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("failed to save movie");
    alert(`Saved "${movie.title}" to your watchlist!`);
  })
  .catch(err => {
    console.error("error saving movie:", err);
    alert(`error saving "${movie.title}"`);
  });
}

// get a random movie from a random genre
async function getRandomMovie() {
  if (genreList.length === 0) return;

  const randomGenre = genreList[Math.floor(Math.random() * genreList.length)];
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${randomGenre.id}`
  );
  const data = await response.json();
  const movie = data.results[Math.floor(Math.random() * data.results.length)];
  displayRandomMovie(movie);
}

// show the random movie
function displayRandomMovie(movie) {
  const container = document.getElementById("random-movie-result");
  container.innerHTML = `
    <div class="feature-card">
      <h3>${movie.title}</h3>
      <p>${movie.overview || "no description available."}</p>
      <button class="cta-button">❤️ Save</button>
    </div>
  `;

  // add save button click
  container.querySelector("button").addEventListener("click", () => saveMovie(movie));
}
