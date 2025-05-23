const apiKey = '71687fee99c471fead84b44849e2b6ad';
let genreList = [];

// when page loads, show genre list in dropdown
document.addEventListener("DOMContentLoaded", async () => {
  const genreSelect = document.getElementById("genre-select");
  if (!genreSelect) return;

  const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
  const data = await response.json();
  genreList = data.genres;

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
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
  const data = await response.json();
  displayMovies(data.results);
}

// show movie cards on page
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
    card.querySelector("button").addEventListener("click", () => saveMovie(movie));
    container.appendChild(card);
  });
}

// save a movie using your own backend API
async function saveMovie(movie) {
  const genreNames = movie.genre_ids.map(id => {
    const match = genreList.find(g => g.id === id);
    return match ? match.name : "unknown";
  });

  const response = await fetch('/api/saved', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: movie.title,
      overview: movie.overview || "no description available.",
      genres: genreNames.join(', ')
    })
  });

  const result = await response.json();
  if (!response.ok) {
    console.error("error saving movie:", result.error);
    alert(`error saving "${movie.title}"`);
  } else {
    alert(`saved "${movie.title}" to your watchlist`);
  }
}

// get a random movie
async function getRandomMovie() {
  if (genreList.length === 0) return;

  const randomGenre = genreList[Math.floor(Math.random() * genreList.length)];
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${randomGenre.id}`);
  const data = await response.json();
  const movie = data.results[Math.floor(Math.random() * data.results.length)];
  displayRandomMovie(movie);
}

// show random movie card
function displayRandomMovie(movie) {
  const container = document.getElementById("random-movie-result");
  container.innerHTML = `
    <div class="feature-card">
      <h3>${movie.title}</h3>
      <p>${movie.overview || "no description available."}</p>
      <button class="cta-button">❤️ Save</button>
    </div>
  `;
  container.querySelector("button").addEventListener("click", () => saveMovie(movie));
}

// load saved movies using your own backend API
async function loadSavedMovies() {
  console.log("loading saved movies...");
  const savedContainer = document.getElementById("saved-movies-container");
  const emptyMessage = document.getElementById("empty-message");

  if (!savedContainer || !emptyMessage) return;

  const response = await fetch('/api/saved');
  const data = await response.json();

  if (!response.ok) {
    console.error("error loading saved movies:", data.error);
    emptyMessage.textContent = "could not load saved movies";
    emptyMessage.style.display = "block";
    return;
  }

  if (data.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  data.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "feature-card";
    card.innerHTML = `
      <h3>${movie.title}</h3>
      <p>${movie.overview || "no description available."}</p>
      <button class="cta-button" onclick="removeMovie(${movie.id})">🗑️ Remove</button>
    `;
    savedContainer.appendChild(card);
  });

  drawChart(data);
}

// draw pie chart based on genres
function drawChart(data) {
  const ctx = document.getElementById('movieChart');
  if (!ctx) return;

  const genreCount = {};
  data.forEach(item => {
    const genres = (item.genres || '').split(', ');
    genres.forEach(genre => {
      if (!genre) return;
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  const labels = Object.keys(genreCount);
  const values = Object.values(genreCount);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'saved movies by genre',
        data: values,
        backgroundColor: [
          '#60a5fa', '#f472b6', '#facc15', '#34d399', '#a78bfa',
          '#f87171', '#f97316', '#2dd4bf', '#4ade80', '#c084fc'
        ]
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
      