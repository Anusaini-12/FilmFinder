document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("audio-upload");
    const resultDiv = document.getElementById("movie-result");
    const uploadIcon = document.querySelector(".upload-icon i");
    const voiceIcon = document.querySelector(".voice-icon i");
    const searchInput = document.getElementById("search");

    const SHAZAM_API_KEY = "59ac4357b7msh98da091bad8e0a4p11e8a7jsn2c14b53ef89c";  
    const TMDB_API_KEY = "1cf50e6248dc270629e802686245c2c8";   


    // ✅ Find Movie Based on the Song Name
    async function findMovieFromSong(songName) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(songName)}&api_key=${TMDB_API_KEY}`);
            const data = await response.json();
            return data.results.length ? data.results[0] : null;
        } catch (error) {
            console.error("Error fetching movie:", error);
            return null;
        }
    }

    // ✅ Display Movie Info
    function displayMovie(movie) {
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";

        resultDiv.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="${posterPath}" alt="${movie.title}">
            <p>${movie.overview || "No description available."}</p>
            <a href="https://www.youtube.com/results?search_query=${movie.title} trailer" target="_blank" class="watch-now-btn"><button>Watch Now</button></a>
        `;

        resultDiv.classList.add("show"); // Show result with fade-in effect
    }

    // ✅ Display Error Messages
    function showError(message) {
        resultDiv.innerHTML = `<p class="error-message">${message}</p>`;
        resultDiv.classList.add("show"); // Ensure error messages are also shown
    }

    // ✅ Voice Search Feature (Auto Search)
    voiceIcon.addEventListener("click", () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Your browser does not support voice recognition.");
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.start();
        searchInput.placeholder = "🎤 Listening...";

        recognition.onresult = async (event) => {
            const speechResult = event.results[0][0].transcript;
            searchInput.value = speechResult;
            console.log("Voice recognized:", speechResult);

            // ✅ Auto Search for Movies
            const movie = await findMovieFromSong(speechResult);
            if (movie) {
                displayMovie(movie);
            } else {
                showError(`No matching movie found for "${speechResult}".`);
            }
        };

        recognition.onerror = (error) => {
            console.error("Speech recognition error:", error);
        };
    });
});
