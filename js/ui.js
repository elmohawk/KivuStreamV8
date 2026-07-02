function createMovieCard(movie){

    return `
        <div class="movie-card">

            <div class="movie-poster">

                <img src="${movie.poster}" alt="${movie.title}">

                <div class="movie-badges">

                    <span class="badge-quality">
                        ${movie.quality || "HD"}
                    </span>

                    <span class="badge-rating">
                        ⭐ ${movie.rating || "0.0"}
                    </span>

                </div>

                <button class="favorite-btn">
                    <i class="ri-heart-line"></i>
                </button>

                <div class="movie-overlay">

                    <button class="card-watch">
                        <i class="ri-play-fill"></i>
                        Watch Now
                    </button>

                </div>

            </div>

            <div class="movie-info">

                <h3 class="movie-title">
                    ${movie.title}
                </h3>

                <div class="movie-meta">

                    <span>${movie.year || ""}</span>

                    <span>${movie.genre || ""}</span>

                </div>

            </div>

        </div>
    `;
}
