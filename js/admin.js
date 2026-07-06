let selectedMovie = null;

// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", () => {

    loadMovies();

    document
        .getElementById("searchBtn")
        .addEventListener("click", searchTMDB);

    document
        .getElementById("saveMovieBtn")
        .addEventListener("click", saveMovie);

});

// =========================
// SEARCH TMDB
// =========================

async function searchTMDB() {

    const query =
        document.getElementById("tmdbSearchInput")
        .value
        .trim();

    if (!query) return;

    const data = await request(
        "/search/multi",
        `&query=${encodeURIComponent(query)}`
    );

    if (!data) return;

    const results = data.results.filter(item =>
        item.media_type === "movie" ||
        item.media_type === "tv"
    );

    document.getElementById("tmdbResults").innerHTML =
        results.map(movie => {

            const poster =
                movie.poster_path
                    ? `${CONFIG.TMDB_IMAGE_URL}${movie.poster_path}`
                    : "assets/poster.jpg";

            return `

<div class="search-card"
onclick="selectMovie(${movie.id},'${movie.media_type}')">

<img src="${poster}">

<h4>${movie.title || movie.name}</h4>

</div>

`;

        }).join("");

}
async function selectMovie(id, type) {

    let endpoint =
        type === "tv"
            ? `/tv/${id}`
            : `/movie/${id}`;

    const movie =
        await request(endpoint, "&append_to_response=videos");

    selectedMovie = movie;

    previewMovie(movie, type);

}
function previewMovie(movie, type) {

    document.getElementById("tmdbPreview")
        .style.display = "flex";

    document.getElementById("previewPoster").src =
        movie.poster_path
            ? `${CONFIG.TMDB_IMAGE_URL}${movie.poster_path}`
            : "assets/poster.jpg";

    document.getElementById("previewTitle").textContent =
        movie.title || movie.name;

    document.getElementById("previewOverview").textContent =
        movie.overview;

    document.getElementById("previewInfo").textContent =
        `⭐ ${movie.vote_average} • ${movie.release_date || movie.first_air_date}`;

    document.getElementById("category").value =
        type === "tv"
            ? "series"
            : "movie";

}
async function saveMovie() {

    if (!selectedMovie) {

        alert("Search a movie first");

        return;

    }

    const trailer =
        selectedMovie.videos?.results.find(v =>
            v.type === "Trailer"
        );

    const { error } =
        await supabaseClient
            .from("movies")
            .insert([{

                title:
                    selectedMovie.title ||
                    selectedMovie.name,

                tmdb_id:
                    selectedMovie.id,

                category:
                    document.getElementById("category").value,

                translator:
                    document.getElementById("translator").value,

                country:
                    document.getElementById("country").value,

                quality:
                    document.getElementById("quality").value,

                featured:
                    document.getElementById("featured").checked,

                worker_url:
                    document.getElementById("workerUrl").value,

                download_links:
                    JSON.parse(
                        document.getElementById("downloadLinks").value || "{}"
                    ),

                poster_path:
                    selectedMovie.poster_path,

                backdrop_path:
                    selectedMovie.backdrop_path,

                overview:
                    selectedMovie.overview,

                vote_average:
                    selectedMovie.vote_average,

                release_date:
                    selectedMovie.release_date ||
                    selectedMovie.first_air_date,

                trailer_key:
                    trailer?.key || null,

                is_active: true

            }]);

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    alert("Movie saved!");

    loadMovies();

}
async function loadMovies() {

    const { data } = await supabaseClient
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });

    document.getElementById("movieList").innerHTML =
        data.map(movie => `

<div class="admin-movie">

<img src="${CONFIG.TMDB_IMAGE_URL}${movie.poster_path}" width="80">

<div>

<h4>${movie.title}</h4>

<p>${movie.translator}</p>

</div>

<button onclick="deleteMovie('${movie.id}')">

Delete

</button>

</div>

`).join("");

}
