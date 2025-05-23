const apiKey = '71687fee99c471fead84b44849e2b6ad';
let genreList = [];

// connect to supabase
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://vrtrfvfmebypbmoyfzfr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydHJmdmZtZWJ5cGJtb3lmemZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjA3ODIsImV4cCI6MjA2MzQ5Njc4Mn0.9pCPmOV7gZHFqkAJm0GSX1pD1PQaSEw-x1eP_tNYwKk'
);

// load genre list on page load
document.addEventListener("DOMContentLoaded", async () => {
  const genreSelect = document.getElementById("genre-select");

  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
    const data = await response.json();
    genreList = data.genres;

    if (genreSelect) {
      genreList.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
      });
    }
  } catch (err) {
    console.error("failed to load genres", err);
  }

  // run only on saved.html
  if (window.location.pathname.includes('saved.html')) {
    loadSavedMovies();
  }
});

// get movies from selected genre
async function getMovies() {
  const genreId = document.getElementById("genre-select").value;
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
  const data = await response.json();
  displayMovies(data.results);
}

// show movie cards
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

// save a movie to supabase (with safe genre handling)
async function saveMovie(movie) {
  const genreIds = Array.isArray(movie.genre_ids) ? movie.genre_ids : [];
  const genreNames = genreIds.map(id => {
    const match = genreList.find(g => g.id === id);
    return match ? match.name : "Unknown";
  });

  const { error } = await supabaseClient
    .from('likedMovies')
    .insert([{
      title: movie.title,
      overview: movie.overview || "no description available.",
      genres: genreNames.length ? genreNames.join(', ') : "Unknown"
    }]);

  if (error) {
    console.error("error saving movie:", error);
    alert(`error saving "${movie.title}"`);
  } else {
    alert(`saved "${movie.title}" to your watchlist`);
  }
}

// get random movie
async function getRandomMovie() {
  if (genreList.length === 0) return;

  const randomGenre = genreList[Math.floor(Math.random() * genreList.length)];
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${randomGenre.id}`);
  const data = await response.json();
  const movie = data.results[Math.floor(Math.random() * data.results.length)];
  displayRandomMovie(movie);
}

// show random movie
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

// load saved movies
async function loadSavedMovies() {
  const savedContainer = document.getElementById("saved-movies-container");
  const emptyMessage = document.getElementById("empty-message");

  const { data, error } = await supabaseClient.from('likedMovies').select('*');

  if (error || !data) {
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

// draw pie chart
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
        label: 'Saved Movies by Genre',
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
          text: 'your saved movies by genre'
        }
      }
    }
  });
}

// delete a saved movie
async function removeMovie(id) {
  const { error } = await supabaseClient
    .from('likedMovies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("error deleting movie:", error);
    alert("couldn't delete");
  } else {
    alert("movie deleted");
    location.reload();
  }
}
