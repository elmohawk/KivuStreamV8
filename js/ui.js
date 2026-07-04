function createMovieCard(movie) {

    const poster = movie.poster_path
        ? `${CONFIG.TMDB_IMAGE_URL}${movie.poster_path}`
        : "assets/images/no-image.png";

    const title = movie.title || movie.name || "Untitled";

    const date = movie.release_date || movie.first_air_date || "Coming Soon";

    const rating = movie.vote_average
        ? movie.vote_average.toFixed(1)
        : "N/A";

    return `
        <div class="movie-card">

            <a href="watch.html?id=${movie.id}">

                <img
                    src="${poster}"
                    alt="${title}"
                    loading="lazy"
                >

                <div class="movie-info">

                    <h3>${title}</h3>

                    <p class="rating">
                        ⭐ ${rating}
                    </p>

                    <small>
                        ${date}
                    </small>

                </div>

            </a>

        </div>
    `;
}
function renderMovie(movie, credits = {}, videos = {}) {

    const hero = document.getElementById("movieHero");

    const backdrop = movie.backdrop_path
        ? `${CONFIG.TMDB_IMAGE_URL}${movie.backdrop_path}`
        : "assets/images/no-image.png";

    const trailer = videos?.results?.find(
        video => video.site === "YouTube" && video.type === "Trailer"
    );

    const cast = credits?.cast
        ? credits.cast.slice(0, 6).map(a => a.name).join(", ")
        : "Unknown";

    const title = movie.title || movie.name || "Untitled";

    const overview = movie.overview || "No description available.";

    const rating = movie.vote_average
        ? movie.vote_average.toFixed(1)
        : "N/A";

    const date = movie.release_date || movie.first_air_date || "Unknown";

    const runtime = movie.runtime || movie.episode_run_time?.[0] || "N/A";

    const genres = movie.genres
        ? movie.genres.map(g => g.name).join(", ")
        : "N/A";

    hero.innerHTML = `
        <section class="watch-hero"
            style="background-image:url('${backdrop}')">

            <div class="watch-overlay">

                <div class="container">

                    <h1>${title}</h1>

                    <p>${overview}</p>

                    <p>
                        ⭐ ${rating}
                        • 📅 ${date}
                        • ⏱ ${runtime} min
                    </p>

                    <p>
                        <strong>Genres:</strong> ${genres}
                    </p>

                    <p>
                        <strong>Cast:</strong> ${cast}
                    </p>

                    <div class="watch-buttons">

                        <button id="favoriteBtn" class="btn btn-primary">
                            ❤️ Add to Favorites
                        </button>

                        <button id="watchLaterBtn" class="btn btn-secondary">
                            ➕ Watch Later
                        </button>

                    </div>

                    ${
                        trailer
                        ? `
                            <iframe
                                width="100%"
                                height="500"
                                src="https://www.youtube.com/embed/${trailer.key}"
                                allowfullscreen>
                            </iframe>
                        `
                        : ""
                    }

                </div>

            </div>

        </section>
    `;
}
