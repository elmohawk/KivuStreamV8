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
await supabase
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
/* ==========================================================
   PLAYER SETUP
========================================================== */

function setupPlayer() {

    if (!player) return;

    if (currentMovie.video) {
        player.src = currentMovie.video;
    }

    player.addEventListener("loadedmetadata", () => {
        resumePlayback();
    });

    player.addEventListener("timeupdate", savePlayback);

    player.addEventListener("ended", () => {

        if (currentMovie.type === "series") {
            autoPlayNextEpisode();
        }

    });

}

/* ==========================================================
   BUTTONS
========================================================== */

function setupButtons() {

    const watchBtn = $("watchBtn");

    if (watchBtn) {

        watchBtn.onclick = () => {

            player.scrollIntoView({
                behavior: "smooth"
            });

            player.play();

        };

    }

    const fullscreenBtn = $("fullscreenBtn");

    if (fullscreenBtn) {

        fullscreenBtn.onclick = () => {

            if (player.requestFullscreen) {

                player.requestFullscreen();

            }

        };

    }

    const theaterBtn = $("theaterBtn");

    if (theaterBtn) {

        theaterBtn.onclick = toggleTheaterMode;

    }

    const pipBtn = $("pipBtn");

    if (pipBtn) {

        pipBtn.onclick = enablePictureInPicture;

    }

}

/* ==========================================================
   THEATER MODE
========================================================== */

function toggleTheaterMode() {

    theaterMode = !theaterMode;

    document.body.classList.toggle(
        "theater-mode",
        theaterMode
    );

}

/* ==========================================================
   PICTURE IN PICTURE
========================================================== */

async function enablePictureInPicture() {

    if (!document.pictureInPictureEnabled) return;

    try {

        if (document.pictureInPictureElement) {

            await document.exitPictureInPicture();

        } else {

            await player.requestPictureInPicture();

        }

    } catch (err) {

        console.error(err);

    }

}

/* ==========================================================
   KEYBOARD SHORTCUTS
========================================================== */

function setupKeyboard() {

    document.addEventListener("keydown", (e) => {

        if (!player) return;

        switch (e.code) {

            case "Space":

                e.preventDefault();

                if (player.paused)
                    player.play();
                else
                    player.pause();

                break;

            case "ArrowRight":

                player.currentTime += 10;

                break;

            case "ArrowLeft":

                player.currentTime -= 10;

                break;

            case "KeyF":

                if (player.requestFullscreen)
                    player.requestFullscreen();

                break;

            case "KeyT":

                toggleTheaterMode();

                break;

            case "KeyM":

                player.muted = !player.muted;

                break;

        }

    });

}

/* ==========================================================
   NEXT EPISODE
========================================================== */

function autoPlayNextEpisode() {

    if (!currentEpisode) return;

    const index = currentEpisodes.findIndex(
        ep => ep.id === currentEpisode.id
    );

    if (index === -1) return;

    const next = currentEpisodes[index + 1];

    if (!next) return;

    playEpisode(next);

}

/* ==========================================================
   PLAY EPISODE
========================================================== */

function playEpisode(ep) {

    currentEpisode = ep;

    player.src = ep.video;

    player.load();

    player.play();

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* ==========================================================
   SHARE
========================================================== */

async function shareMovie() {

    if (!currentMovie) return;

    if (navigator.share) {

        await navigator.share({

            title: currentMovie.title,

            text: currentMovie.description,

            url: location.href

        });

    }

}

/* ==========================================================
   LIKE
========================================================== */

async function likeMovie() {

    if (!currentMovie) return;

    const likes = (currentMovie.likes || 0) + 1;

    await supabaseClient
        .from(currentMovie.type === "series" ? "series" : "movies")
        .update({
            likes
        })
        .eq("id", currentMovie.id);

    currentMovie.likes = likes;

    $("detailLikes").textContent = likes;

}

/* ==========================================================
   MY LIST
========================================================== */

function saveMyList() {

    let list = JSON.parse(
        localStorage.getItem("myList")
    ) || [];

    if (!list.find(x => x.id == currentMovie.id)) {

        list.unshift(currentMovie);

        localStorage.setItem(
            "myList",
            JSON.stringify(list)
        );

    }

}
/* ==========================================================
   EPISODE BROWSER
========================================================== */

async function loadEpisodes() {

    const container = $("episodesContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="loading-card">
            Loading Episodes...
        </div>
    `;

    const { data, error } = await supabaseClient
        .from("episodes")
        .select("*")
        .eq("series_id", currentMovie.id)
        .order("season", { ascending: true })
        .order("episode", { ascending: true });

    if (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-state">
                No Episodes Available
            </div>
        `;

        return;

    }

    currentEpisodes = data || [];

    if (!currentEpisodes.length) {

        container.innerHTML = `
            <div class="empty-state">
                No Episodes Available
            </div>
        `;

        return;

    }

    renderEpisodeBrowser();

}

/* ==========================================================
   SEASONS
========================================================== */

function renderEpisodeBrowser() {

    const container = $("episodesContainer");

    if (!container) return;

    const seasons = [
        ...new Set(
            currentEpisodes.map(ep => ep.season)
        )
    ];

    container.innerHTML = "";

    seasons.forEach(season => {

        const section = document.createElement("div");

        section.className = "season-section";

        section.innerHTML = `

            <h2 class="season-title">

                Season ${season}

            </h2>

            <div class="episode-grid"
                 id="season_${season}">
            </div>

        `;

        container.appendChild(section);

        const grid = $("season_" + season);

        currentEpisodes
            .filter(ep => ep.season == season)
            .forEach(ep => {

                grid.appendChild(
                    createEpisodeCard(ep)
                );

            });

    });

}

/* ==========================================================
   EPISODE CARD
========================================================== */

function createEpisodeCard(ep) {

    const card = document.createElement("div");

    card.className = "episode-card fade-up";

    card.innerHTML = `

        <div class="episode-number">

            EP ${ep.episode}

        </div>

        <div class="episode-info">

            <h3>

                ${ep.title}

            </h3>

            <p>

                ${ep.runtime || "45"} min

            </p>

        </div>

        <div class="episode-actions">

            <button class="watch-btn">

                ▶ Watch

            </button>

            <button class="download-btn">

                ⬇ Download

            </button>

        </div>

    `;

    card.querySelector(".watch-btn")
        .onclick = () => {

            playEpisode(ep);

        };

    card.querySelector(".download-btn")
        .onclick = () => {

            if (ep.download) {

                window.open(
                    ep.download,
                    "_blank"
                );

            }

        };

    return card;

}

/* ==========================================================
   SMART DOWNLOAD SYSTEM
========================================================== */

function renderDownloads() {

    const panel = $("downloadPanel");

    if (!panel) return;

    panel.innerHTML = "";

    /* ======================
       SERIES
    ====================== */

    if (currentMovie.type === "series") {

        panel.innerHTML = `

            <div class="download-header">

                📺 Download Episodes

            </div>

            <p>

                Choose an episode below.

            </p>

        `;

        return;

    }

    /* ======================
       MULTI PART MOVIE
    ====================== */

    if (Array.isArray(currentMovie.parts)
        && currentMovie.parts.length) {

        panel.innerHTML = `

            <div class="download-header">

                📥 Download Movie

            </div>

        `;

        currentMovie.parts.forEach((part,index)=>{

            const btn =
                document.createElement("button");

            btn.className =
                "download-part-btn";

            btn.innerHTML =
                `⬇ Part ${index+1}`;

            btn.onclick=()=>{

                window.open(
                    part,
                    "_blank"
                );

            };

            panel.appendChild(btn);

        });

        return;

    }

    /* ======================
       SINGLE MOVIE
    ====================== */

    const button =
        document.createElement("button");

    button.className =
        "download-main-btn";

    button.innerHTML =
        "⬇ Download Movie";

    button.onclick = () => {

        if(currentMovie.download){

            window.open(
                currentMovie.download,
                "_blank"
            );

        }

    };

    panel.appendChild(button);

}

/* ==========================================================
   WATCH FIRST EPISODE
========================================================== */

function playFirstEpisode(){

    if(!currentEpisodes.length) return;

    playEpisode(currentEpisodes[0]);

}

/* ==========================================================
   WATCH LAST EPISODE
========================================================== */

function resumeLastEpisode(){

    const saved = JSON.parse(

        localStorage.getItem(

            "episode_"+currentMovie.id

        )

    );

    if(!saved) return;

    const ep = currentEpisodes.find(

        x=>x.id==saved.id

    );

    if(ep){

        playEpisode(ep);

        player.currentTime = saved.time;

    }

}

/* ==========================================================
   SAVE EPISODE MEMORY
========================================================== */

function saveEpisodeMemory(){

    if(

        currentMovie.type!=="series"

        ||

        !currentEpisode

    ) return;

    localStorage.setItem(

        "episode_"+currentMovie.id,

        JSON.stringify({

            id:currentEpisode.id,

            time:player.currentTime

        })

    );

}

setInterval(

    saveEpisodeMemory,

    5000

);
/* ==========================================================
   CAST (TMDB)
========================================================== */

async function renderCast() {

    const container = $("castSlider");

    if (!container) return;

    container.innerHTML = "";

    if (!tmdbData || !tmdbData.cast || !tmdbData.cast.length) {

        container.innerHTML = `
            <div class="empty-state">
                Cast unavailable.
            </div>
        `;

        return;

    }

    tmdbData.cast.slice(0, 15).forEach(actor => {

        container.innerHTML += `

            <div class="cast-card">

                <img
                    src="${actor.photo}"
                    loading="lazy"
                    alt="${actor.name}"
                >

                <div class="cast-name">
                    ${actor.name}
                </div>

                <div class="cast-character">
                    ${actor.character}
                </div>

            </div>

        `;

    });

}

/* ==========================================================
   COMMENTS
========================================================== */

async function loadComments() {

    const container = $("commentsContainer");

    if (!container) return;

    const { data, error } = await supabaseClient
        .from("comments")
        .select("*")
        .eq("movie_id", currentMovie.id)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(error);

        return;

    }

    if (!data.length) {

        container.innerHTML = `
            <div class="empty-state">
                No comments yet.
            </div>
        `;

        return;

    }

    container.innerHTML = data.map(comment => {

        const avatar =
            (comment.username || "K")
            .substring(0,1)
            .toUpperCase();

        return `

        <div class="comment-card">

            <div class="comment-avatar">

                ${avatar}

            </div>

            <div class="comment-content">

                <div class="comment-header">

                    <strong>

                        ${comment.username || "Guest"}

                    </strong>

                    <span>

                        ${new Date(comment.created_at)
                            .toLocaleDateString()}

                    </span>

                </div>

                <div class="comment-text">

                    ${comment.comment}

                </div>

            </div>

        </div>

        `;

    }).join("");

}

/* ==========================================================
   ADD COMMENT
========================================================== */

async function addComment() {

    const input = $("commentInput");

    if (!input) return;

    const text = input.value.trim();

    if (!text) return;

    await supabaseClient
        .from("comments")
        .insert([{

            movie_id: currentMovie.id,

            username: "Guest",

            comment: text

        }]);

    input.value = "";

    loadComments();

}

/* ==========================================================
   RECOMMENDATIONS
========================================================== */

async function renderRecommendations() {

    const container = $("recommendedSlider");

    if (!container) return;

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("category", currentMovie.category)
        .neq("id", currentMovie.id)
        .limit(12);

    if (error) {

        console.error(error);

        return;

    }

    container.innerHTML = "";

    data.forEach(movie => {

        container.innerHTML += `

            <div class="recommend-card"
                 onclick="location.href='watch.html?id=${movie.id}'">

                <img
                    src="${movie.image}"
                    loading="lazy"
                >

                <div class="recommend-info">

                    <h3>

                        ${movie.title}

                    </h3>

                    <div class="recommend-meta">

                        ⭐ ${movie.rating || "8.5"}

                    </div>

                </div>

            </div>

        `;

    });

}

/* ==========================================================
   CONTINUE WATCHING
========================================================== */

function saveContinueWatching() {

    let list =
        JSON.parse(
            localStorage.getItem("continueWatching")
        ) || [];

    list =
        list.filter(
            x => x.id !== currentMovie.id
        );

    list.unshift({

        id: currentMovie.id,

        title: currentMovie.title,

        image: currentMovie.image,

        poster: currentMovie.image,

        time: player.currentTime

    });

    list = list.slice(0, 20);

    localStorage.setItem(

        "continueWatching",

        JSON.stringify(list)

    );

}

player?.addEventListener(

    "timeupdate",

    saveContinueWatching

);

/* ==========================================================
   REPORT MOVIE
========================================================== */

async function reportMovie(reason) {

    await supabaseClient
        .from("reports")
        .insert([{

            movie_id: currentMovie.id,

            reason

        }]);

    alert("Report submitted.");

}

/* ==========================================================
   TRAILER
========================================================== */

function playTrailer() {

    if (!tmdbData?.trailer) return;

    const modal = $("trailerModal");

    const iframe = $("trailerFrame");

    iframe.src =
        `https://www.youtube.com/embed/${tmdbData.trailer}?autoplay=1`;

    modal.classList.add("show");

}

function closeTrailer() {

    $("trailerModal")
        .classList.remove("show");

    $("trailerFrame").src = "";

}

/* ==========================================================
   SHARE
========================================================== */

async function shareMovie() {

    if (navigator.share) {

        await navigator.share({

            title: currentMovie.title,

            text: currentMovie.description,

            url: location.href

        });

    } else {

        navigator.clipboard.writeText(location.href);

        alert("Link copied.");

    }

}

/* ==========================================================
   INIT EXTRA
========================================================== */

window.addEventListener("beforeunload", () => {

    savePlayback();

    saveEpisodeMemory();

    saveContinueWatching();

});
