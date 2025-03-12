const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

const movieDetails = document.getElementById('movie-details');
const loadingSpinner = document.getElementById('loading-spinner');

loadingSpinner.style.display = 'block';

fetch(`${BASE_URL}/movie/${movieId}?${API_KEY}`)
    .then(res => res.json())
    .then(movie => {
        document.title = movie.title;

        movieDetails.innerHTML = `
            <div class="movie-banner" style="background-image: url('${movie.backdrop_path ? IMG_URL + movie.backdrop_path : 'https://via.placeholder.com/1920x400'}');">
                <h1>${movie.title} (${movie.release_date.split('-')[0]})</h1>
            </div>
            <div class="movie-info-container">
                <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/300x450'}" alt="${movie.title}">
                <div class="movie-details-text">
                    <p><strong>⭐ Rating:</strong> ${movie.vote_average}</p>
                    <p><strong>🎬 Genre:</strong> ${movie.genres ? movie.genres.map(g => g.name).join(', ') : "Unknown"}</p>
                    <p><strong>📅 Release Date:</strong> ${movie.release_date}</p>
                    <p><strong>📖 Overview:</strong> ${movie.overview}</p>
                    <p><strong><a href="https://www.youtube.com/results?search_query=${movie.title} trailer" target="_blank" class="watch-now-btn">🎥 Watch Now</a></strong></p>

                </div>
            </div>
            <div id="trailer-container"></div>
            <h2 style="color: white; font-size: 3rem; text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8); text-align: center">Cast</h2>
            <div id="cast-container" class="cast-grid"></div>
        `;

        getMovieTrailer(movieId);
        getMovieCast(movieId);
    })
    .catch(error => {
        console.error('Error fetching movie details:', error);
        movieDetails.innerHTML = `<h1 class="no-results">Failed to load movie details. Please try again later.</h1>`;
    })
    .finally(() => {
        loadingSpinner.style.display = 'none';
    });

    //getMovies trailer/teaser
    function getMovieTrailer(movieId) {
        fetch(`${BASE_URL}/movie/${movieId}/videos?${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                let video = data.results.find(video => video.type === "Trailer") || 
                            data.results.find(video => video.type === "Teaser");
                
                if (video) {
                    document.getElementById('trailer-container').innerHTML = `
                        <h2>Trailer</h2>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.key}" frameborder="0" allowfullscreen></iframe>
                    `;
                } else {
                    document.getElementById('trailer-container').innerHTML = `<h2>No Trailer Available</h2>`;
                }
            })
            .catch(error => {
                console.error('Error fetching trailer:', error);
                document.getElementById('trailer-container').innerHTML = `<h2>Failed to load trailer.</h2>`;
            });
    }
//show casts  
function getMovieCast(movieId) {
    fetch(`${BASE_URL}/movie/${movieId}/credits?${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const cast = data.cast.slice(0, 6);
            const castContainer = document.getElementById('cast-container');

            cast.forEach(actor => {
                const castCard = document.createElement('div');
                castCard.classList.add('cast-card');
                castCard.innerHTML = `
                    <img src="${actor.profile_path ? IMG_URL + actor.profile_path : 'https://via.placeholder.com/150x225?text=No+Image'}" alt="${actor.name}">
                    <p><strong>${actor.name}</strong></p>
                    <p>${actor.character}</p>
                `;
                castContainer.appendChild(castCard);
            });
        })
        .catch(error => {
            console.error('Error fetching cast:', error);
            document.getElementById('cast-container').innerHTML = `<h2>Failed to load cast details.</h2>`;
        });
}

function goBack() {
    window.history.back();
}