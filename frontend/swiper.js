const apiKey = '71687fee99c471fead84b44849e2b6ad';
const swiperWrapper = document.getElementById("featured-swiper");

// load featured movies on page load
async function loadFeaturedMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await response.json();
    displayFeatured(data.results.slice(0, 10)); // show top 10
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

    // add click to save movie
    slide.querySelector("button").addEventListener("click", () => saveMovie(movie));

    swiperWrapper.appendChild(slide);
  });

  // set up swiper slider
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

// send movie to backend
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
    .then((res) => {
      if (!res.ok) throw new Error("failed to save movie");
      return res.json();
    })
    .then(() => {
      alert(`Saved "${movie.title}" to your watchlist!`);
    })
    .catch((err) => {
      console.error("error saving movie:", err);
      alert(`error saving "${movie.title}"`);
    });
}

// run on load
document.addEventListener("DOMContentLoaded", loadFeaturedMovies);
