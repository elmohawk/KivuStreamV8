let seriesPage = 1;
let seriesQuery = "";

document.addEventListener("DOMContentLoaded", () => {

    loadSeries();

    document
        .getElementById("seriesSearchBtn")
        .addEventListener("click", searchSeriesHandler);

    document
        .getElementById("loadMoreSeriesBtn")
        .addEventListener("click", loadMoreSeries);

});
async function loadSeries() {

    const data = seriesQuery
        ? await searchSeriesPage(seriesQuery, seriesPage)
        : await getPopularSeriesPage(seriesPage);

    if (!data) return;

    const grid = document.getElementById("seriesGrid");

    if (seriesPage === 1) {
        grid.innerHTML = "";
    }

    grid.innerHTML += data.results
        .map(createMovieCard)
        .join("");

}
function searchSeriesHandler() {

    seriesQuery = document
        .getElementById("seriesSearchBox")
        .value
        .trim();

    seriesPage = 1;

    loadSeries();

}
function loadMoreSeries() {

    seriesPage++;

    loadSeries();

}
