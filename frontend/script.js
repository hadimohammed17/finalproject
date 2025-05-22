const apiKey = '71687fee99c471fead84b44849e2b6ad';
let genreList = [];

// Load genres into dropdown on DOM load
document.addEventListener("DOMContentLoaded", async () => {
  const genreSelect = document.getElementById("genre-select");
  if (!genreSelect) return;

  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
  );
  const data = await response.json();
  genreList = data.genres;

  genreList.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
});

// Get movies by selected genre
async function getMovies() {
  const genreId = document.getElementById("genre-select").value;
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`
  );
  const data = await response.json();
  displayMovies(data.results);
}

// Display list of movies
function displayMovies(movies) {
  const container = document.getElementById("movies-container");
  container.innerHTML = "";

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "feature-card";
    card.innerHTML = `
      <h3>${movie.title}</h3>
      <p>${movie.overview || "No description available."}</p>
      <button class="cta-button" onclick='saveMovie(${JSON.stringify(movie)})'>❤️ Save</button>
    `;
    container.appendChild(card);
  });
}

// Save a movie to localStorage
function saveMovie(movie) {
  // Save to Supabase backend
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
    if (!res.ok) throw new Error("Failed to save movie");
    alert(`Saved "${movie.title}" to your watchlist!`);
  })
  .catch(err => {
    console.error("Error saving movie:", err);
    alert(`Error saving "${movie.title}"`);
  });
}


// Random movie picker
async function getRandomMovie() {
  if (genreList.length === 0) return;

  const randomGenre =
    genreList[Math.floor(Math.random() * genreList.length)];
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${randomGenre.id}`
  );
  const data = await response.json();
  const movie = data.results[Math.floor(Math.random() * data.results.length)];
  displayRandomMovie(movie);
}

// Show random movie
function displayRandomMovie(movie) {
  const container = document.getElementById("random-movie-result");
  container.innerHTML = `
    <div class="feature-card">
      <h3>${movie.title}</h3>
      <p>${movie.overview || "No description available."}</p>
      <button class="cta-button" onclick='saveMovie(${JSON.stringify(movie)})'>❤️ Save</button>
    </div>
  `;
}
