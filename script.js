const API_KEY = "a1f92cfb27aa3b9e66cb42880700f6d9";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

const movieList = document.getElementById("movie-list");
const trendingList = document.getElementById("trending-list");
const searchBox = document.getElementById("search-box");
const tagsEl = document.getElementById("tags");
const movieTitle = document.getElementById("movie-title");

// Genre List
const genres = [
    { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" }, { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" }, { id: 36, name: "History" },
    { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" }, { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" }, { id: 10752, name: "War" },
    { id: 37, name: "Western" }
];

let selectedGenre = null;

document.addEventListener("DOMContentLoaded", () => {
    getTrendingMovies();
    getPopularMovies();

    if (tagsEl) {
        setGenres();
    }

    fetchRandomMovieBackground();
});

// ✅ SEARCH FEATURE: Redirects to Search Results Page
if (searchBox) {
    searchBox.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchBox.value.trim();
            if (query.length > 0) {
                localStorage.setItem("searchQuery", query);
                window.location.href = "search-results.html"; 
            }
        }
    });
}

// ✅ SEARCH RESULTS PAGE HANDLING
document.addEventListener("DOMContentLoaded", () => {
    const searchResultsContainer = document.getElementById("search-results");
    const searchQuery = localStorage.getItem("searchQuery");

    if (searchQuery && searchResultsContainer) {
        fetchMovies(searchQuery);
    }

    async function fetchMovies(query) {
        try {
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
            if (!response.ok) throw new Error("Search failed.");
            const data = await response.json();
            displayMovies(data.results, searchResultsContainer);
        } catch (error) {
            console.error("Error searching movies:", error.message);
        }
    }
});

// Fetch Trending Movies
async function getTrendingMovies() {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch trending movies.");
        const data = await response.json();
        displayMovies(data.results, trendingList);
    } catch (error) {
        console.error("Error fetching trending movies:", error.message);
    }
}

// Fetch Popular Movies or by Genre
async function getPopularMovies(genreId = null) {
    try {
        let url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        if (genreId) {
            url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch movies.");
        const data = await response.json();
        
        displayMovies(data.results, movieList);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
    }
}

// Fetch Background Image for Hero Section
async function fetchRandomMovieBackground() {
    try {
        const heroSection = document.getElementById("hero");
        if (!heroSection) return; // ✅ Prevents the error if #hero is missing

        const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch background image.");
        
        const data = await response.json();

        if (data.results.length > 0) {
            const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
            const backdropPath = randomMovie.backdrop_path;

            if (backdropPath) {
                heroSection.style.backgroundImage = `url('${IMG_BASE_URL}${backdropPath}')`;
            }
        }
    } catch (error) {
        console.error("Error fetching background:", error);
    }
}
// Search Movies
async function searchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        if (!response.ok) throw new Error("Search failed.");
        const data = await response.json();
        displayMovies(data.results, movieList);
    } catch (error) {
        console.error("Error searching movies:", error.message);
    }
}

// Display Movies
function displayMovies(movies, container) {
    if (!container) return; // Prevent errors if container is missing

    container.innerHTML = "";
    if (!movies || movies.length === 0) {
        container.innerHTML = "<p class='text-white text-center'>No movies found.</p>";
        return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Load favorites

    movies.forEach(movie => {
        const moviePoster = movie.poster_path
            ? `${IMG_BASE_URL}${movie.poster_path}`
            : "https://dummyimage.com/300x450/000000/ffffff&text=No+Image"; 
        
        const isFavorite = favorites.some(fav => fav.id === movie.id); // Check if movie is liked
        const heartIcon = isFavorite ? "❤️" : "♡";
        const heartColor = isFavorite ? "text-red-500" : "text-gray-400";

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card", "relative"); // Ensure it's positioned correctly

        movieCard.innerHTML = `
            <!-- ❤️ Like Button (Top Right) -->
            <button onclick="toggleFavorite(this, ${movie.id}, '${movie.title}', '${moviePoster}')" 
                class="absolute top-2 right-2 text-2xl ${heartColor} hover:text-red-500 transition">
                ${heartIcon}
            </button>

            <img src="${moviePoster}" onerror="this.onerror=null; this.src='placeholder.jpg';">
            <div class="movie-info">
                <p class="movie-title">${movie.title}</p>
                <p class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</p>
            </div>
            <div class="movie-hover">
                <button onclick="getMovieDetails(${movie.id})">View Details</button>
            </div>
        `;

        container.appendChild(movieCard);
    });
}

// Toggle Favorite Function (Fixed)
function toggleFavorite(button, movieId, title, poster) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let movieIndex = favorites.findIndex(movie => movie.id === movieId);

    if (movieIndex === -1) {
        // ✅ Add to favorites and fill the heart ❤️
        favorites.push({ id: movieId, title, poster });
        button.innerHTML = "❤️"; 
        button.classList.add("text-red-500");
        alert("⭐ Movie added to favorites!");
    } else {
        // ❌ Remove from favorites and empty the heart ♡
        favorites.splice(movieIndex, 1);
        button.innerHTML = "♡"; 
        button.classList.remove("text-red-500");
        alert("Movie removed from favorites.");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ✅ Make sure toggleFavorite is globally accessible
window.toggleFavorite = toggleFavorite;

// Fetch full movie details and navigate to details page
async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
        if (!response.ok) throw new Error("Failed to fetch movie details.");
        const data = await response.json();
        localStorage.setItem("selectedMovie", JSON.stringify(data));
        window.location.href = "movie-details.html";
    } catch (error) {
        console.error("Error fetching movie details:", error.message);
    }
}

// Set Genres
function setGenres() {
    if (!tagsEl) return;  // ✅ Prevent error if `tagsEl` does not exist

    tagsEl.innerHTML = "";
    genres.forEach(genre => {
        const tag = document.createElement("div");
        tag.classList.add("tag", "cursor-pointer", "px-4", "py-2", "rounded-lg", "bg-gray-800", "text-white", "hover:bg-red-500", "transition");

        tag.innerText = genre.name;

        tag.addEventListener("click", () => {
            if (selectedGenre === genre.id) {
                selectedGenre = null;
                movieTitle.innerText = "🔥 Popular Movies";
            } else {
                selectedGenre = genre.id;
                movieTitle.innerText = `🔥 ${genre.name} Movies`;
            }

            getPopularMovies(selectedGenre);
            highlightSelectedGenre();
        });

        tagsEl.appendChild(tag);
    });
}

// Highlight Selected Genre
function highlightSelectedGenre() {
    document.querySelectorAll(".tag").forEach(tag => {
        tag.classList.remove("bg-red-500");
        tag.classList.add("bg-gray-800");
    });
}
// const scrollToTopBtn = document.getElementById("scrollToTop");

// window.addEventListener("scroll", () => {
//     if (window.scrollY > 300) {
//         scrollToTopBtn.classList.remove("hidden");
//     } else {
//         scrollToTopBtn.classList.add("hidden");
//     }
// });

// scrollToTopBtn.addEventListener("click", () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
// });
getPopularMovies();
getTrendingMovies();

