let currentPage = 1;
let currentQuery = "";

document.addEventListener("DOMContentLoaded", () => {

    loadMovies();

    document
        .getElementById("searchBtn")
        .addEventListener("click", search);

    document
        .getElementById("loadMoreBtn")
        .addEventListener("click", loadMore);

});
async function loadMovies() {

    const data = currentQuery
        ? await searchMoviesPage(currentQuery, currentPage)
        : await getPopularMoviesPage(currentPage);

    if (!data) return;

    const grid = document.getElementById("moviesGrid");

    if (currentPage === 1)
        grid.innerHTML = "";

    grid.innerHTML += data.results
        .map(createMovieCard)
        .join("");

}
function search() {

    currentQuery =
        document.getElementById("searchBox")
        .value
        .trim();

    currentPage = 1;

    loadMovies();

}
function loadMore() {

    currentPage++;

    loadMovies();

}
