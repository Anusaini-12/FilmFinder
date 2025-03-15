document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("media-upload");
    const resultDiv = document.getElementById("movie-result");
    const uploadIcon = document.querySelector(".upload-icon i");
    const voiceIcon = document.querySelector(".voice-icon i");
    const searchInput = document.getElementById("search");

    const TMDB_API_KEY = "a1f92cfb27aa3b9e66cb42880700f6d9";   
    const IMAGGA_AUTH_KEY = "Basic YWNjX2RhZmM0ZjU0M2QyNmExNzoyYjA3OWM4MjFiZGRmYWUxMmRjYTE4ZGU1NmIzYWVlNw=="; // Replace with your base64(auth_key:auth_secret)

    // ✅ Image Upload & Preview Function
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("preview").src = e.target.result;
            document.getElementById("preview").style.display = "block";
        };
        reader.readAsDataURL(file);

        // ✅ Automatically Process Image After Selection
        uploadImage(file);
    });

    // ✅ Upload Image & Get Tags from Imagga
    async function uploadImage(file) {
        if (!file) {
            alert("Please select an image!");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        // Show loading text
        resultDiv.innerHTML = `<p>⏳ Analyzing image...</p>`;
        resultDiv.classList.add("show");

        try {
            const response = await fetch("https://api.imagga.com/v2/tags", {
                method: "POST",
                headers: { "Authorization": IMAGGA_AUTH_KEY },
                body: formData
            });

            const data = await response.json();
            if (data.result && data.result.tags.length > 0) {
                const detectedMovie = data.result.tags[0].tag.en; // Get the most relevant tag
                console.log("Detected Movie Tag:", detectedMovie);
                findMovieFromTag(detectedMovie); // Search TMDb for movie details
            } else {
                showError("No movie-related tags found!");
            }
        } catch (error) {
            console.error("Error:", error);
            showError("Error analyzing image!");
        }
    }

    // ✅ Search Movie Using the Tag from Imagga
    async function findMovieFromTag(tag) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(tag)}&api_key=${TMDB_API_KEY}`);
            const data = await response.json();

            if (data.results.length > 0) {
                displayMovie(data.results[0]); // Get the best match
            } else {
                showError(`No matching movie found for "${tag}".`);
            }
        } catch (error) {
            console.error("Error fetching movie:", error);
            showError("Error fetching movie details.");
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
            findMovieFromTag(speechResult);
        };

        recognition.onerror = (error) => {
            console.error("Speech recognition error:", error);
        };
    });
});
