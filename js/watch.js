document.addEventListener("DOMContentLoaded", init);

async function init() {

    const params = new URLSearchParams(window.location.search);

    const movieId = params.get("id");

    if (!movieId) {

        window.location.href = "movies.html";
        return;

    }

    await loadMovie(movieId);
    await loadRecommendations(movieId);

}

async function loadMovie(id) {

    const movie = await getMovieDetails(id);
    const credits = await getMovieCredits(id);
    const videos = await getMovieVideos(id);

    renderMovie(movie, credits, videos);

    setupMovieActions(id); // use id directly

}

function setupMovieActions(movieId) {

    const favoriteBtn =
        document.getElementById("favoriteBtn");

    const watchLaterBtn =
        document.getElementById("watchLaterBtn");

    if (favoriteBtn) {

        favoriteBtn.addEventListener("click", async () => {

            const success = await addFavorite(movieId);

            if (success) {

                favoriteBtn.textContent = "❤️ Added to My List";

            }

        });

    }

    if (watchLaterBtn) {

        watchLaterBtn.addEventListener("click", async () => {

            const success = await addWatchlist(movieId);

            if (success) {

                watchLaterBtn.textContent = "✔ Added to Watchlist";

            }

        });

    }

}

async function loadRecommendations(id) {

    const data = await getMovieRecommendations(id);

    if (!data) return;

    document.getElementById("recommendations").innerHTML =
        data.results
            .slice(0, 8)
            .map(createMovieCard)
            .join("");

}
