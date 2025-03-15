const API_KEY = 'api_key=a1f92cfb27aa3b9e66cb42880700f6d9';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const searchURL = `${BASE_URL}/search/movie?${API_KEY}`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

let currentPage = 1;
let totalPages = 100;
let lastUrl = '';
let selectedGenre = [];

//Set Genre Tags
function setGenre() {
    tagsEl.innerHTML = '';
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
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if (selectedGenre.includes(genre.id)) {
                selectedGenre = selectedGenre.filter(id => id !== genre.id);
            } else {
                selectedGenre.push(genre.id);
            }
            getMovies(`${API_URL}&with_genres=${encodeURI(selectedGenre.join(','))}`);
            highlightSelection();
        });
        tagsEl.append(t);
    });
}
setGenre();

function highlightSelection() {
    document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('highlight'));
    selectedGenre.forEach(id => document.getElementById(id).classList.add('highlight'));
}

//Fetch Movies
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        if (data.results.length !== 0) {
            showMovies(data.results);
            currentPage = data.page;
            totalPages = data.total_pages;
            current.innerText = currentPage;
            prev.classList.toggle('disabled', currentPage <= 1);
            next.classList.toggle('disabled', currentPage >= totalPages);
        } else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
        }
    });
}

//Display Movies
function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/300x450'}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/>
                <button class="more-info" onclick="goToDetails(${id})">More Info 🎥</button>
            </div>
        `;

        main.appendChild(movieEl);
    });
}

// Function to redirect to movie details page
function goToDetails(id) {
    window.location.href = `movie.html?id=${id}`;
}

//Open Movie Details
function openNav(id) {
    fetch(`${BASE_URL}/movie/${id}/videos?${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {
            document.getElementById("myNav").style.width = "100%";
            if (videoData.results.length > 0) {
                overlayContent.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoData.results[0].key}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                overlayContent.innerHTML = `<h1 class="no-results">No Trailer Found</h1>`;
            }
        });
}

//Color Rating
function getColor(vote) {
    return vote >= 8 ? 'green' : vote >= 5 ? 'orange' : 'red';
}

//Search Movies
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if (searchTerm) {
        selectedGenre = [];
        setGenre();
        getMovies(`${searchURL}&query=${searchTerm}`);
    } else {
        getMovies(API_URL);
    }
});

//Pagination Controls
prev.addEventListener('click', () => currentPage > 1 && pageCall(currentPage - 1));
next.addEventListener('click', () => currentPage < totalPages && pageCall(currentPage + 1));

function pageCall(page) {
    const url = new URL(lastUrl);
    url.searchParams.set('page', page);
    getMovies(url.toString());
}

//Hero Background
function setHeroBackground() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const movie = data.results[Math.floor(Math.random() * data.results.length)];
            document.getElementById('hero').style.backgroundImage = `url('${IMG_URL + movie.backdrop_path}')`;
        })
        .catch(() => {
            document.getElementById('hero').style.backgroundImage = "url('https://via.placeholder.com/1920x400')";
        });
}
setHeroBackground();



//Smooth Scroll for "Explore" Button
document.getElementById('cta-button').addEventListener('click', () => {
    document.querySelector('header').scrollIntoView({ behavior: 'smooth' });
});

//Back to Top Button
const backToTopButton = document.createElement('button');
backToTopButton.id = 'back-to-top';
backToTopButton.className = 'btn';
backToTopButton.textContent = '↑';
backToTopButton.style.display = 'none';
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

//Load Initial Movies
getMovies(API_URL);
