const apiKey = '71687fee99c471fead84b44849e2b6ad';
const swiperWrapper = document.getElementById("featured-swiper");

// ✅ Fix supabase client init
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://vrtrfvfmebypbmoyfzfr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydHJmdmZtZWJ5cGJtb3lmemZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjA3ODIsImV4cCI6MjA2MzQ5Njc4Mn0.9pCPmOV7gZHFqkAJm0GSX1pD1PQaSEw-x1eP_tNYwKk'
);

// load featured movies on page load
async function loadFeaturedMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await response.json();
    displayFeatured(data.results.slice(0, 10));
  } catch (err) {
    console.error("failed to load featured movies", err);
  }
}

// show movies inside swiper
function displayFeatured(movies) {
  swiperWrapper.innerHTML = "";

  movies.forEach((movie) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide feature-card";
    slide.style.minHeight = "300px";

    slide.innerHTML = `
      <h3>${movie.title}</h3>
      <p>${movie.overview || "no description available."}</p>
      <button class="cta-button">❤️ Save</button>
    `;

    slide.querySelector("button").addEventListener("click", () => saveMovie(movie));
    swiperWrapper.appendChild(slide);
  });

  // ✅ Properly initialize Swiper
  new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      480: { slidesPerView: 1 },
    },
  });
}

// save movie to supabase
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

// run on load
document.addEventListener("DOMContentLoaded", loadFeaturedMovies);
