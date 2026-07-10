"use strict";

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

    let { data } = await supabase
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

        alert("Movie not found.");

        location.href = "index.html";

        return;

    }

    currentMovie = data;

    renderMovie();

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

    $("watchHero").style.backgroundImage =
        `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.9)),
        url('${currentMovie.image}')`;

}
