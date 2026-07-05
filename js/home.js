document.addEventListener("DOMContentLoaded", async () => {

    await loadTrending();

    await loadPopular();

    await loadTopRated();

    await loadSeries();

});
async function loadFeatured(){

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("featured", true);

    renderSupabaseMovies(data);

}
async function loadPopular() {

    const data = await getPopularMovies();

    renderMovies("popularMovies", data);

}

async function loadTopRated() {

    const data = await getTopRatedMovies();

    renderMovies("topRatedMovies", data);

}

async function loadSeries() {

    const data = await getPopularSeries();

    renderMovies("popularSeries", data);

}

function renderMovies(id, data) {

    if (!data) return;

    const container = document.getElementById(id);

    if (!container) return;

    container.innerHTML = data.results
        .slice(0, 12)
        .map(createMovieCard)
        .join("");

}
function renderSupabaseMovies(movies){

    const container =
        document.getElementById("trendingMovies");

    container.innerHTML = movies.map(movie => `

        <div class="movie-card">

            <img src="${movie.poster}">

            <h3>${movie.title}</h3>

            <a href="watch.html?id=${movie.id}">
                Watch
            </a>

        </div>

    `).join("");

}
