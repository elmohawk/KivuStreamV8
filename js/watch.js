// GET ID FROM URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// DOM ELEMENTS
const titleEl = document.getElementById("movieTitle");
const yearEl = document.getElementById("year");
const ratingEl = document.getElementById("rating");
const runtimeEl = document.getElementById("runtime");
const overviewEl = document.getElementById("overview");
const videoPlayer = document.getElementById("videoPlayer");

// LOAD MOVIE
async function loadMovie(){

    if(!movieId) return;

    const res = await fetch(
        `${TMDB_BASE}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );

    const movie = await res.json();

    // SET UI
    titleEl.textContent = movie.title;
    yearEl.textContent = movie.release_date?.split("-")[0];
    ratingEl.textContent = "⭐ " + movie.vote_average;
    runtimeEl.textContent = movie.runtime + " min";
    overviewEl.textContent = movie.overview;

    // TEMP VIDEO (replace later with Supabase storage)
    videoPlayer.src = "assets/sample.mp4";

}

loadMovie();
async function protectWatchPage(){

    const { data } = await supabase.auth.getSession();

    if(!data.session){

        alert("Please login to watch movies");
        window.location.href = "login.html";

    }

}

protectWatchPage();
