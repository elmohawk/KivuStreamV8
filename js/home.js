document.addEventListener("DOMContentLoaded", async () => {

    await loadTrending();

    await loadPopular();

    await loadTopRated();

    await loadSeries();

});

async function loadTrending() {

    const data = await getTrendingMovies();

    renderMovies("trendingMovies", data);

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
