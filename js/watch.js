/* ==========================================================
   KIVUSTREAM PRO WATCH PAGE
   VERSION 2.0
========================================================== */

"use strict";

/* ==========================================================
   GLOBAL STATE
========================================================== */

let currentMovie = null;

let tmdbData = null;

let movieId = null;

let player = null;

let currentEpisode = null;

let playbackTimer = null;

let theaterMode = false;

/* ==========================================================
   DOM
========================================================== */

const $ = (id) => document.getElementById(id);

/* ==========================================================
   INIT
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    player = $("player");

    const params = new URLSearchParams(window.location.search);

    movieId = params.get("id");

    if (!movieId) {

        window.location.href = "index.html";

        return;

    }

    showLoading();

    await loadMovie();

    hideLoading();

    setupPlayer();

    setupButtons();

    setupKeyboard();

});
/* ==========================================================
   LOAD MOVIE
========================================================== */

async function loadMovie(){

try{

let movie=null;

/* SEARCH MOVIES */

let result=
await supabaseClient
.from("movies")
.select("*")
.eq("id",movieId)
.maybeSingle();

movie=result.data;

/* SEARCH SERIES */

if(!movie){

result=
await supabaseClient
.from("series")
.select("*")
.eq("id",movieId)
.maybeSingle();

movie=result.data;

}

if(!movie){

alert("Content not found");

window.location.href="index.html";

return;

}

currentMovie=movie;

/* TMDB */

tmdbData=
await enrichTMDB(movie);

/* UI */

renderHero();

renderDetails();

renderDownloads();

renderCast();

renderRecommendations();

loadComments();

if(movie.type==="series"){

loadEpisodes();

}

}catch(err){

console.error(err);

}
}
/* ==========================================================
   TMDB
========================================================== */

async function enrichTMDB(movie){

try{

const results=
await searchTMDB(movie.title);

if(!results.length){

return null;

}

const id=results[0].id;

if(movie.type==="series"){

return await getSeriesDetails(id);

}

return await getMovieDetails(id);

}catch(e){

console.error(e);

return null;

}

}
/* ==========================================================
   HERO
========================================================== */

function renderHero(){

const backdrop=

tmdbData?.backdrop ||

currentMovie.banner ||

currentMovie.image;

$("watchHero").style.backgroundImage=`

linear-gradient(
rgba(0,0,0,.2),
rgba(0,0,0,.9)
),

url(${backdrop})

`;

$("moviePoster").src=

tmdbData?.poster ||

currentMovie.image ||

"assets/logo.png";

$("movieTitle").textContent=

currentMovie.title;

$("movieDescription").textContent=

tmdbData?.overview ||

currentMovie.description ||

"No description.";

$("movieCategory").textContent=

currentMovie.category || "";

$("movieRuntime").textContent=

tmdbData?.runtime

? tmdbData.runtime+" min"

:"";

$("movieTranslator").textContent=

currentMovie.translator ||

"KivuStream";

$("movieYear").textContent=

tmdbData?.year ||

currentMovie.year ||

"";

}
/* ==========================================================
   DETAILS
========================================================== */

function renderDetails(){

$("detailGenre").textContent=

tmdbData?.genres?.join(", ") ||

currentMovie.category;

$("detailCountry").textContent=

tmdbData?.country ||

"Unknown";

$("detailLanguage").textContent=

tmdbData?.language ||

"Unknown";

$("detailRuntime").textContent=

tmdbData?.runtime

? tmdbData.runtime+" min"

:"";

$("detailTranslator").textContent=

currentMovie.translator ||

"KivuStream";

$("detailViews").textContent=

currentMovie.views || 0;

$("detailLikes").textContent=

currentMovie.likes || 0;

$("detailRelease").textContent=

tmdbData?.year ||

"";
}
/* ==========================================================
   LOADING
========================================================== */

function showLoading(){

document.body.classList.add("loading");

}

function hideLoading(){

document.body.classList.remove("loading");

}
/* ==========================================================
   CONTINUE WATCHING
========================================================== */

function savePlayback(){

if(!player)return;

const progress={

id:currentMovie.id,

time:player.currentTime

};

localStorage.setItem(

"watch_"+currentMovie.id,

JSON.stringify(progress)

);

}

function resumePlayback(){

const saved=

JSON.parse(

localStorage.getItem(

"watch_"+currentMovie.id

)

);

if(!saved)return;

player.currentTime=saved.time;

}

setInterval(savePlayback,5000);
