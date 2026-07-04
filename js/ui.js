function createMovieCard(movie) {
    return `
        <article class="movie-card">
            <a href="watch.html?id=${movie.id}">
                <img
                    src="${CONFIG.TMDB_IMAGE_URL}${movie.poster_path}"
                    alt="${movie.title}"
                    loading="lazy"
                >

                <div class="movie-info">
                    <h3>${movie.title}</h3>

                    <p>⭐ ${movie.vote_average.toFixed(1)}</p>

                    <small>${movie.release_date || "Unknown"}</small>
                </div>
            </a>
        </article>
    `;
}
