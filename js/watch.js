/* ===========================================
   KIVUSTREAM PRO WATCH PAGE
=========================================== */

import { supabase } from "./supabase.js";
import { enrich } from "./api.js";
import { getEpisodes } from "./database.js";
import { toast } from "./ui.js";

/* ===========================================
   STATE
=========================================== */

let currentMovie = null;

/* ===========================================
   INIT
=========================================== */

document.addEventListener("DOMContentLoaded", loadMovie);

/* ===========================================
   LOAD MOVIE
=========================================== */

async function loadMovie() {

    try {

        const params = new URLSearchParams(location.search);

        const id = params.get("id");

        if (!id) {

            toast("Movie not found");

            return;

        }

        /* Movies */

        let { data } = await supabase

            .from("movies")

            .select("*")

            .eq("id", id)

            .maybeSingle();

        /* Series */

        if (!data) {

            const series = await supabase

                .from("series")

                .select("*")

                .eq("id", id)

                .maybeSingle();

            data = series.data;

            if (data) {

                data.type = "series";

            }

        }

        if (!data) {

            toast("Content not found");

            return;

        }

        currentMovie = await enrich(data);

        renderMovie();

        loadRelated();

        loadComments();

        if (currentMovie.type === "series") {

            loadEpisodesUI();

        }

        saveContinueWatching();

    }

    catch (err) {

        console.error(err);

        toast("Failed loading");

    }

}

/* ===========================================
   RENDER
=========================================== */

function renderMovie() {

    document.title = currentMovie.title;

    $("#movie-title").textContent = currentMovie.title;

    $("#movie-description").textContent =

        currentMovie.description || "";

    $("#movie-rating").textContent =

        currentMovie.rating || "N/A";

    $("#movie-year").textContent =

        (currentMovie.year || "").substring(0,4);

    $("#movie-category").textContent =

        currentMovie.category || "";

    $("#movie-poster").src =

        currentMovie.poster;

    $("#movie-banner").style.backgroundImage =

`linear-gradient(

rgba(0,0,0,.80),

rgba(0,0,0,.45)

),

url(${currentMovie.banner})`;

    if (currentMovie.trailer) {

        $("#trailer-btn").onclick = () => {

            window.open(

                `https://youtube.com/watch?v=${currentMovie.trailer}`,

                "_blank"

            );

        };

    }

    $("#watch-btn").onclick = playMovie;

    $("#download-btn").onclick = downloadMovie;

}

/* ===========================================
   PLAYER
=========================================== */

function playMovie() {

    const player = $("#player");

    if (!player) return;

    player.src = currentMovie.video;

    player.play();

    player.scrollIntoView({

        behavior: "smooth"

    });

}

function downloadMovie() {

    if (!currentMovie.download) {

        toast("No download available");

        return;

    }

    window.open(

        currentMovie.download,

        "_blank"

    );

}

/* ===========================================
   SERIES
=========================================== */

async function loadEpisodesUI() {

    const episodes =

        await getEpisodes(currentMovie.id);

    const container =

        $("#episodes");

    if (!container) return;

    if (!episodes.length) {

        container.innerHTML =

        "<p>No Episodes</p>";

        return;

    }

    container.innerHTML = episodes

        .map(ep => `

<div class="episode-card">

<div>

<b>S${ep.season}</b>

<b>E${ep.episode}</b>

</div>

<h4>${ep.title}</h4>

<button

class="watchEpisode"

data-video="${ep.video}"

>

▶ Watch

</button>

</div>

`)

.join("");

    container

    .querySelectorAll(".watchEpisode")

    .forEach(btn => {

        btn.onclick = () => {

            $("#player").src =

            btn.dataset.video;

            $("#player").play();

        };

    });

}

/* ===========================================
   COMMENTS
=========================================== */

async function loadComments() {

    const { data } =

    await supabase

        .from("comments")

        .select("*")

        .eq("movie_id",

            currentMovie.id)

        .order(

            "created_at",

            {

                ascending:false

            }

        );

    const list=$("#comments");

    if(!list)return;

    list.innerHTML=(data||[])

    .map(comment=>`

<div class="comment">

${comment.comment}

</div>

`).join("");

}

/* ===========================================
   RELATED
=========================================== */

async function loadRelated(){

const {data}=await supabase

.from(

currentMovie.type==="series"

?

"series"

:

"movies"

)

.select("*")

.eq(

"category",

currentMovie.category

)

.limit(12);

const container=$("#related");

if(!container)return;

container.innerHTML=(data||[])

.filter(x=>x.id!==currentMovie.id)

.map(movie=>`

<a

href="watch.html?id=${movie.id}"

class="related-card">

<img

src="${movie.image}"

>

<h4>

${movie.title}

</h4>

</a>

`)

.join("");

}

/* ===========================================
   CONTINUE WATCHING
=========================================== */

function saveContinueWatching(){

let history=

JSON.parse(

localStorage.getItem(

"continueWatching"

)

)||[];

history=

history.filter(

m=>m.id!==currentMovie.id

);

history.unshift(currentMovie);

history=history.slice(0,15);

localStorage.setItem(

"continueWatching",

JSON.stringify(history)

);

}

/* ===========================================
   HELPERS
=========================================== */

function $(id){

return document.getElementById(id);

}
