/* ===========================================
   KIVUSTREAM - PRO STREAMING ENGINE
=========================================== */

import { supabase } from "./supabase.js";
import { toast } from "./ui.js";

/* ---------------------------
   GLOBAL STATE (PRO)
----------------------------*/
const state = {
  movie: null,
  episodes: [],
  currentSeason: null
};

const db = supabase;

/* ---------------------------
   INIT
----------------------------*/
document.addEventListener("DOMContentLoaded", init);

async function init() {
  const id = getQueryId();

  if (!id) return showError("Missing movie ID");

  try {
    await loadMovie(id);
  } catch (err) {
    console.error(err);
    showError("Failed to load content");
  }
}

/* ---------------------------
   QUERY HELPER
----------------------------*/
function getQueryId() {
  return new URLSearchParams(location.search).get("id");
}

/* ---------------------------
   SAFE DB WRAPPER
----------------------------*/
async function query(promise) {
  const { data, error } = await promise;

  if (error) {
    console.error("DB ERROR:", error);
    throw error;
  }

  return data;
}

/* ---------------------------
   LOAD MOVIE
----------------------------*/
async function loadMovie(id) {
  state.movie = await query(
    db.from("movies")
      .select("*")
      .eq("id", id)
      .single()
  );

  renderMovie(state.movie);

  await Promise.all([
    loadComments(id),
    loadRecommended()
  ]);

  if (state.movie.type === "series") {
    await loadEpisodes(id);
  }
}

/* ---------------------------
   RENDER MOVIE (ONE TIME DOM BIND)
----------------------------*/
function renderMovie(movie) {
  document.title = movie.title || "Watch";

  set("movie-title", movie.title);
  set("movie-description", movie.description);
  set("movie-category", `🎭 ${movie.category || "Entertainment"}`);
  set("movie-translator", `🎙 ${movie.translator || "KivuStream"}`);
  set("movie-type", movie.type === "series" ? "📺 Series" : "🎬 Movie");
  set("movie-status", movie.status || "🔥 Trending");

  setAttr("movie-poster", "src", movie.image || "./logo.png");

  setBackdrop(movie.banner || movie.image);

  bindActions(movie);
}

/* ---------------------------
   BACKDROP HANDLING
----------------------------*/
function setBackdrop(url) {
  const el = document.querySelector(".hero-backdrop");

  if (el) el.style.backgroundImage = `url(${url})`;

  document.body.style.setProperty("--movie-bg", `url(${url})`);
}

/* ---------------------------
   ACTIONS (PLAY / DOWNLOAD / COMMENT)
----------------------------*/
function bindActions(movie) {
  document.getElementById("watch-btn")?.onclick = () =>
    play(movie.video);

  document.getElementById("download-btn")?.onclick = () => {
    if (movie.download) window.open(movie.download, "_blank");
  };

  document.getElementById("comment-btn")?.onclick = () =>
    postComment(movie.id);
}

/* ---------------------------
   PLAYER ENGINE
----------------------------*/
function play(src) {
  const player = document.getElementById("player");
  if (!player || !src) return;

  player.src = src;
  player.play?.();
  player.scrollIntoView({ behavior: "smooth" });
}

/* ---------------------------
   EPISODES (SERIES ENGINE)
----------------------------*/
async function loadEpisodes(seriesId) {
  state.episodes = await query(
    db.from("episodes")
      .select("*")
      .eq("series_id", seriesId)
      .order("season")
  );

  const seasons = [...new Set(state.episodes.map(e => e.season))];

  renderSeasons(seasons);

  if (seasons.length) {
    state.currentSeason = seasons[0];
    showSeason(seasons[0]);
  }
}

/* ---------------------------
   SEASONS UI
----------------------------*/
function renderSeasons(seasons) {
  const container = $("#season-buttons");
  if (!container) return;

  container.innerHTML = "";

  seasons.forEach(season => {
    const btn = document.createElement("button");
    btn.textContent = `Season ${season}`;
    btn.onclick = () => showSeason(season);
    container.appendChild(btn);
  });
}

/* ---------------------------
   EPISODE RENDER
----------------------------*/
function showSeason(season) {
  state.currentSeason = season;

  const container = $("#episodes-container");
  if (!container) return;

  container.innerHTML = "";

  const episodes = state.episodes.filter(e => e.season == season);

  episodes.forEach(ep => {
    const el = document.createElement("div");
    el.className = "episode-card";

    el.innerHTML = `
      <div class="episode-left">
        <span class="episode-number">EP ${ep.episode}</span>
        <div>
          <h3>${ep.title}</h3>
          <small>Season ${ep.season}</small>
        </div>
      </div>
      <div class="episode-actions">
        <button class="watch">▶</button>
        <button class="download">⬇</button>
      </div>
    `;

    el.querySelector(".watch").onclick = () => play(ep.video);
    el.querySelector(".download").onclick = () =>
      ep.download && window.open(ep.download);

    container.appendChild(el);
  });
}

/* ---------------------------
   COMMENTS ENGINE (SAFE)
----------------------------*/
function escape(str = "") {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

async function loadComments(movieId) {
  const data = await query(
    db.from("comments")
      .select("*")
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false })
  );

  const container = $("#comments-container");
  if (!container) return;

  container.innerHTML = (data || [])
    .map(c => `
      <div class="comment">
        <strong>${escape(c.username || "User")}</strong>
        <p>${escape(c.text)}</p>
        <small>${new Date(c.created_at).toLocaleString()}</small>
      </div>
    `)
    .join("");
}

/* ---------------------------
   POST COMMENT (PRO SAFE)
----------------------------*/
async function postComment(movieId) {
  const input = $("#comment-input");
  const user = $("#username-input");

  const text = input?.value.trim();
  const username = user?.value.trim() || "Guest";

  if (!text) return alert("Write a comment");

  const btn = $("#comment-btn");
  btn.disabled = true;
  btn.textContent = "Posting...";

  try {
    await query(
      db.from("comments").insert([
        { movie_id: movieId, username, text }
      ])
    );

    input.value = "";
    loadComments(movieId);

  } catch (err) {
    alert("Comment failed");
  } finally {
    btn.disabled = false;
    btn.textContent = "Post";
  }
}

/* ---------------------------
   RECOMMENDED
----------------------------*/
async function loadRecommended() {
  const data = await query(
    db.from("movies").select("*").limit(12)
  );

  const container = $("#recommended-container");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(m => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="${m.image}" />
      <h3>${m.title}</h3>
    `;

    card.onclick = () =>
      (location.href = `watch.html?id=${m.id}`);

    container.appendChild(card);
  });
}

/* ---------------------------
   HELPERS (PRO CLEAN ACCESS)
----------------------------*/
function $(id) {
  return document.getElementById(id);
}

function set(id, value) {
  const el = $(id);
  if (el) el.textContent = value || "";
}

function setAttr(id, attr, value) {
  const el = $(id);
  if (el && value) el.setAttribute(attr, value);
}

/* ---------------------------
   ERROR HANDLER UI
----------------------------*/
function showError(msg) {
  alert(msg);
}

/* ---------------------------
   LOADER CLEANUP
----------------------------*/
window.addEventListener("load", () => {
  $("#loading-screen")?.remove();
});
