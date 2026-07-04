function createMovieCard(movie) {

    const poster = movie.poster_path
        ? `${CONFIG.TMDB_IMAGE_URL}${movie.poster_path}`
        : "assets/images/no-image.png";

    return `

        <div class="movie-card">

            <a href="watch.html?id=${movie.id}">

                <img
                    src="${poster}"
                    alt="${movie.title}"
                    loading="lazy"
                >

                <div class="movie-info">

                    <h3>${movie.title}</h3>

                    <p class="rating">
                        ⭐ ${movie.vote_average.toFixed(1)}
                    </p>

                    <small>
                        ${movie.release_date || "Coming Soon"}
                    </small>

                </div>

            </a>

        </div>

    `;
}
