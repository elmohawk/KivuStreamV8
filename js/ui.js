function createMovieCard(movie){

    return `

    <article class="movie-card">

        <div class="movie-poster">

            <img src="${getImage(movie.poster_path)}"
                 alt="${movie.title}"
                 loading="lazy">

            <div class="poster-gradient"></div>

            <div class="movie-top">

                <span class="quality">

                    ${movie.vote_average >= 8 ? "4K" : "HD"}

                </span>

                <button class="favorite-btn"
                        data-id="${movie.id}">

                    <i class="ri-heart-line"></i>

                </button>

            </div>

            <div class="movie-overlay">

                <button class="play-btn">

                    <i class="ri-play-fill"></i>

                </button>

            </div>

            <div class="movie-rating">

                ⭐ ${movie.vote_average.toFixed(1)}

            </div>

        </div>

        <div class="movie-info">

            <h3>${movie.title}</h3>

            <div class="movie-meta">

                <span>

                    ${movie.release_date?.slice(0,4) || "--"}

                </span>

                <span>

                    ${movie.genre_names || "Movie"}

                </span>

            </div>

        </div>

    </article>

    `;

}
