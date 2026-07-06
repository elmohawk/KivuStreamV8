/* ===========================================
   KIVUSTREAM - NETFLIX LEVEL ENGINE
=========================================== */

import { supabase } from "./supabase.js";

const db = supabase;

/* ---------------------------
   STATE ENGINE
----------------------------*/
const state = {
  movie: null,
  episodes: [],
  currentEpisodeIndex: 0,
  progressTimer: null,
  lastTime: 0
};

/* ---------------------------
   INIT
----------------------------*/
document.addEventListener("DOMContentLoaded", init);

async function init() {
  const id = getId();
  if (!id) return;

  await loadMovie(id);
}

/* ---------------------------
   GET ID
----------------------------*/
function getId() {
  return new URLSearchParams(location.search).get("id");
}

/* ---------------------------
   SAFE QUERY
----------------------------*/
async function q(promise) {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
}

/* ---------------------------
   LOAD MOVIE
----------------------------*/
async function loadMovie(id) {
  state.movie = await q(
    db.from("movies").select("*").eq("id", id).single()
  );

  renderMovie(state.movie);

  if (state.movie.type === "series") {
    await loadEpisodes(id);
  }

  loadContinueWatching(id);
}

/* ---------------------------
   RENDER MOVIE
----------------------------*/
function renderMovie(m) {
  document.title = m.title;

  set("movie-title", m.title);
  set("movie-description", m.description);
  set("movie-category", m.category);
  set("movie-type", m.type);

  setAttr("movie-poster", "src", m.image);

  setBackdrop(m.banner || m.image);

  document.getElementById("watch-btn").onclick = () => {
    play(m.video);
  };

  document.getElementById("download-btn").onclick = () => {
    if (m.download) window.open(m.download);
  };
}

/* ---------------------------
   BACKDROP
----------------------------*/
function setBackdrop(url) {
  const el = document.querySelector(".hero-backdrop");
  if (el) el.style.backgroundImage = `url(${url})`;
}

/* ---------------------------
   PLAYER (NETFLIX ENGINE)
----------------------------*/
function play(src, episodeId = null, index = 0) {
  const video = document.getElementById("player");
  if (!video || !src) return;

  state.currentEpisodeIndex = index;

  video.src = src;
  video.play();

  video.scrollIntoView({ behavior: "smooth" });

  enableProgressTracking(episodeId);
  enableAutoNext();
}

/* ---------------------------
   AUTO NEXT EPISODE
----------------------------*/
function enableAutoNext() {
  const video = document.getElementById("player");

  video.onended = () => {
    if (!state.episodes.length) return;

    const next = state.currentEpisodeIndex + 1;

    if (next < state.episodes.length) {
      const ep = state.episodes[next];
      play(ep.video, ep.id, next);
    }
  };
}

/* ---------------------------
   PROGRESS TRACKING
----------------------------*/
function enableProgressTracking(episodeId) {
  const video = document.getElementById("player");

  clearInterval(state.progressTimer);

  state.progressTimer = setInterval(() => {
    if (!episodeId) return;

    saveProgress(episodeId, video.currentTime, video.duration);
  }, 5000);
}

/* ---------------------------
   SAVE PROGRESS (SUPABASE)
----------------------------*/
async function saveProgress(episodeId, current, duration) {
  const userId = "guest"; // replace with auth user later

  await db.from("watch_progress").upsert({
    user_id: userId,
    movie_id: state.movie.id,
    episode_id: episodeId,
    progress: current,
    duration: duration,
    updated_at: new Date()
  });
}

/* ---------------------------
   CONTINUE WATCHING
----------------------------*/
async function loadContinueWatching(movieId) {
  const userId = "guest";

  const data = await q(
    db.from("watch_progress")
      .select("*")
      .eq("movie_id", movieId)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
  );

  if (data?.length) {
    const last = data[0];

    setTimeout(() => {
      const video = document.getElementById("player");
      video.currentTime = last.progress || 0;
    }, 1000);
  }
}

/* ---------------------------
   EPISODES
----------------------------*/
async function loadEpisodes(seriesId) {
  state.episodes = await q(
    db.from("episodes")
      .select("*")
      .eq("series_id", seriesId)
      .order("season")
  );

  renderEpisodes(state.episodes);
}

/* ---------------------------
   EPISODE UI
----------------------------*/
function renderEpisodes(list) {
  const container = document.getElementById("episodes-container");
  if (!container) return;

  container.innerHTML = "";

  list.forEach((ep, i) => {
    const div = document.createElement("div");

    div.className = "episode-card";

    div.innerHTML = `
      <div>
        <h3>EP ${ep.episode} - ${ep.title}</h3>
      </div>
      <button>▶ Play</button>
    `;

    div.querySelector("button").onclick = () =>
      play(ep.video, ep.id, i);

    container.appendChild(div);
  });
}

/* ---------------------------
   HELPERS
----------------------------*/
function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute(attr, value);
}

/* ---------------------------
   CLEANUP
----------------------------*/
window.addEventListener("load", () => {
  document.getElementById("loading-screen")?.remove();
});
