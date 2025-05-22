const apiKey = '71687fee99c471fead84b44849e2b6ad';
const swiperWrapper = document.getElementById("featured-swiper");

async function loadFeaturedMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await response.json();
    displayFeatured(data.results.slice(0, 10)); // Top 10 movies
  } catch (err) {
    console.error("Failed to load featured movies", err);
  }
}

function displayFeatured(movies) {
  swiperWrapper.innerHTML = "";

  movies.forEach((movie) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide feature-card";
    slide.style.minHeight = "300px";
    slide.innerHTML = `
      <h3>${movie.title}</h3>
      <p>${movie.overview || "No description available."}</p>
      <button class="cta-button" onclick='saveMovie(${JSON.stringify(movie)})'>❤️ Save</button>
    `;
    swiperWrapper.appendChild(slide);
  });

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

function saveMovie(movie) {
  const saved = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const exists = saved.some((m) => m.id === movie.id);

  if (!exists) {
    saved.push({ title: movie.title, overview: movie.overview, id: movie.id });
    localStorage.setItem("likedMovies", JSON.stringify(saved));
    alert(`Saved "${movie.title}" to your watchlist!`);
  } else {
    alert(`"${movie.title}" is already in your watchlist.`);
  }
}

document.addEventListener("DOMContentLoaded", loadFeaturedMovies);
