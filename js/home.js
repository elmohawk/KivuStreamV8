document.addEventListener("DOMContentLoaded", async () => {

    const trending = await API.getTrendingMovies();

    if (!trending) return;

    const container = document.getElementById("trendingMovies");

    container.innerHTML = trending.results
        .slice(0, 12)
        .map(createMovieCard)
        .join("");

});
