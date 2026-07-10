/* ===========================
   GLOBALS
=========================== */

let currentMovie = null;
let player = null;

const $ = (id) => document.getElementById(id);

/* ===========================
   INIT
=========================== */

document.addEventListener("DOMContentLoaded", init);

async function init() {

    player = $("player");

    const params = new URLSearchParams(location.search);

    const movieId = params.get("id");

    if (!movieId) {

        location.href = "index.html";
        return;

    }

    await loadMovie(movieId);

}

/* ===========================
   LOAD MOVIE
=========================== */

async function loadMovie(id) {

    let { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (!data) {

        const result = await supabase
            .from("series")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        data = result.data;

    }

    if (!data) {

        alert("Movie not found");

        location.href = "index.html";

        return;

    }

    currentMovie = data;

    // Show Supabase data immediately
    renderMovie();
    renderDownloads();
    // Load TMDB details
    await loadTMDB();

}
let tmdbData = null;

async function loadTMDB() {

    try {

        tmdbData = await enrich(currentMovie);

        renderTMDB();

    }

    catch(err){

        console.error("TMDB Error:", err);

    }

}
function renderTMDB() {

    if(!tmdbData) return;

    /* Hero */

    if(tmdbData.banner){

        $("watchHero").style.backgroundImage=`
        linear-gradient(
        rgba(0,0,0,.4),
        rgba(0,0,0,.9)
        ),
        url(${tmdbData.banner})
        `;

    }

    if(tmdbData.poster){

        $("moviePoster").src=tmdbData.poster;

    }
if($("movieRating")){

    $("movieRating").textContent=

        "⭐ "+(tmdbData.rating || "N/A");

}
    /* Description */

    $("movieDescription").textContent=

        tmdbData.overview ||

        currentMovie.description ||

        "";

    /* Details */

    $("detailGenre").textContent=

        tmdbData.genres
        ?.map(g=>g.name)
        .join(", ") ||

        currentMovie.category ||

        "";

    $("detailLanguage").textContent=

        tmdbData.language ||

        "";

    $("detailRuntime").textContent=

        tmdbData.runtime ?

        tmdbData.runtime+" min"

        :"";

    $("detailRelease").textContent=

        tmdbData.year ||

        "";

}
/* ===========================
   RENDER
=========================== */

function renderMovie() {

    $("movieTitle").textContent =
        currentMovie.title || "";

    $("movieDescription").textContent =
        currentMovie.description || "";

    $("movieCategory").textContent =
        currentMovie.category || "";

    $("movieTranslator").textContent =
        currentMovie.translator || "KivuStream";

    $("moviePoster").src =
        currentMovie.image || "assets/logo.png";

    $("player").src =
        currentMovie.video || "";

    $("watchHero").style.backgroundImage = `
linear-gradient(
rgba(0,0,0,.4),
rgba(0,0,0,.9)
),
url('${currentMovie.image}')
`;

}
/* ==========================================
   DOWNLOAD SYSTEM
========================================== */

function renderDownloads() {

    const panel = $("downloadPanel");

    if (!panel) return;

    panel.innerHTML = "";

    /* =====================
       SERIES
    ===================== */

    if (currentMovie.type === "series") {

        panel.innerHTML = `
            <div class="download-info">
                📺 Download episodes from the Episodes section below.
            </div>
        `;

        return;

    }

    /* =====================
       MULTIPLE SERVERS
    ===================== */

    if (Array.isArray(currentMovie.downloads) &&
        currentMovie.downloads.length) {

        currentMovie.downloads.forEach((server, index) => {

            const card = document.createElement("div");

            card.className = "download-card";

            card.innerHTML = `
                <h3>Server ${index + 1}</h3>

                <button class="download-btn">
                    ⬇ Download
                </button>
            `;

            card.querySelector("button").onclick = () => {

                window.open(server, "_blank");

            };

            panel.appendChild(card);

        });

        return;

    }

    /* =====================
       MULTI PART
    ===================== */

    if (Array.isArray(currentMovie.parts) &&
        currentMovie.parts.length) {

        currentMovie.parts.forEach((part, index) => {

            const card = document.createElement("div");

            card.className = "download-card";

            card.innerHTML = `
                <h3>Part ${index + 1}</h3>

                <button class="download-btn">
                    ⬇ Download Part
                </button>
            `;

            card.querySelector("button").onclick = () => {

                window.open(part, "_blank");

            };

            panel.appendChild(card);

        });

        return;

    }

    /* =====================
       SINGLE DOWNLOAD
    ===================== */

    if (currentMovie.download) {

        panel.innerHTML = `
            <div class="download-card">

                <h3>Movie Download</h3>

                <button id="mainDownloadBtn"
                        class="download-btn">

                    ⬇ Download Movie

                </button>

            </div>
        `;

        $("mainDownloadBtn").onclick = () => {

            window.open(currentMovie.download, "_blank");

        };

        return;

    }

    panel.innerHTML = `
        <div class="download-info">

            No download available.

        </div>
    `;

}
let currentEpisodes = [];
let currentSeason = 1;

async function loadEpisodes() {

    if (currentMovie.type !== "series") {

        $("episodesSection").style.display = "none";
        return;

    }

    currentEpisodes = await getEpisodes(currentMovie.id);

    renderSeasonTabs();
    renderEpisodes(1);

}
function renderSeasonTabs() {

    const tabs = $("seasonTabs");

    tabs.innerHTML = "";

    const seasons = [...new Set(
        currentEpisodes.map(ep => ep.season)
    )];

    seasons.forEach(season => {

        const button = document.createElement("button");

        button.textContent = "Season " + season;

        button.onclick = () => {

            currentSeason = season;

            renderEpisodes(season);

        };

        tabs.appendChild(button);

    });

}
function renderEpisodes(season) {

    const grid = $("episodeGrid");

    grid.innerHTML = "";

    currentEpisodes
        .filter(ep => ep.season == season)
        .forEach(ep => {

            const card = document.createElement("div");

            card.className = "episode-card";

            card.innerHTML = `
                <h3>Episode ${ep.episode}</h3>
                <p>${ep.title}</p>

                <button>▶ Watch</button>

                <button>⬇ Download</button>
            `;

            card.querySelectorAll("button")[0].onclick = () => {

                player.src = ep.video;

                player.play();

            };

            card.querySelectorAll("button")[1].onclick = () => {

                if (ep.download) {

                    window.open(ep.download);

                }

            };

            grid.appendChild(card);

        });

}
