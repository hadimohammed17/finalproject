const apiKey = '71687fee99c471fead84b44849e2b6ad';
let genreList = [];

// ✅ Supabase setup
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://vrtrfvfmebypbmoyfzfr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydHJmdmZtZWJ5cGJtb3lmemZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjA3ODIsImV4cCI6MjA2MzQ5Njc4Mn0.9pCPmOV7gZHFqkAJm0GSX1pD1PQaSEw-x1eP_tNYwKk'
);

// load genres into dropdown when page opens
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

// get movies based on selected genre
async function getMovies() {
  const genreId = document.getElementById("genre-select").value;
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
  const data = await response.json();
  displayMovies(data.results);
}

// show list of movies
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

// save a movie to supabase
async function saveMovie(movie) {
  const { error } = await supabaseClient
    .from('likedMovies')
    .insert([{ title: movie.title, overview: movie.overview || "no description available." }]);

  if (error) {
    console.error("error saving movie:", error);
    alert(`error saving "${movie.title}"`);
  } else {
    alert(`saved "${movie.title}" to your watchlist`);
  }
}

// get a random movie from a random genre
async function getRandomMovie() {
  if (genreList.length === 0) return;

  const randomGenre = genreList[Math.floor(Math.random() * genreList.length)];
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${randomGenre.id}`);
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
  container.querySelector("button").addEventListener("click", () => saveMovie(movie));
}

// load saved movies on saved.html
async function loadSavedMovies() {
  console.log("loading saved movies...");
  const savedContainer = document.getElementById("saved-movies-container");
  const emptyMessage = document.getElementById("empty-message");

  if (!savedContainer || !emptyMessage) return;

  const { data, error } = await supabaseClient.from('likedMovies').select('*');

  if (error) {
    console.error("error loading saved movies:", error);
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
    `;
    savedContainer.appendChild(card);
  });

  // draw chart after loading movies
  drawChart(data);
}

// draw chart of saved movies
function drawChart(data) {
  const ctx = document.getElementById('movieChart');
  if (!ctx) return;

  const titles = data.map(item => item.title);
  const lengths = data.map(item => (item.overview || '').length);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: titles,
      datasets: [{
        label: 'Movie Description Lengths',
        data: lengths,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Saved Movie Descriptions'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

if (window.location.pathname.includes('saved.html')) {
  loadSavedMovies();
}