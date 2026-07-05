
function createMovieCard(movie) {

    const title = movie.title || "Untitled";

    const year = (movie.release_date || "")
        .substring(0, 4);

    const rating = movie.vote_average
        ? movie.vote_average.toFixed(1)
        : "N/A";

    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "assets/poster.jpg";

    return `
        <a href="watch.html?id=${movie.id}" class="movie-card">

            <div class="poster">

                <img src="${poster}" alt="${title}">

                <div class="card-overlay">
                    <div class="play-btn">
                        <i class="fa-solid fa-play"></i>
                    </div>
                </div>

                <span class="rating">⭐ ${rating}</span>
                <span class="quality">HD</span>

            </div>

            <div class="card-info">
                <h3>${title}</h3>
                <p>${year}</p>
            </div>

        </a>
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
