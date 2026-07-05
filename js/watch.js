
// =====================================
// WATCH.JS (SUPABASE ONLY)
// =====================================

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

// =====================================
// LOAD MOVIE
// =====================================

async function loadMovie(id) {

    // 1. Get your data from Supabase
    const { data: movie } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

    if (!movie) return;

    // 2. Get TMDB details
    const tmdb = await getTmdbDetails(
        movie.tmdb_id,
        movie.category
    );

    // 3. Merge data
    const fullData = {
        ...tmdb,
        ...movie
    };

    renderMovie(fullData);
}

// =====================================
// RECOMMENDATIONS (SUPABASE)
// =====================================

async function loadRecommendations(id) {

    const { data: currentMovie } = await supabaseClient
        .from("movies")
        .select("category")
        .eq("id", id)
        .single();

    if (!currentMovie) return;

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("category", currentMovie.category)
        .eq("is_active", true)
        .neq("id", id)
        .limit(8);

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById("recommendations");

    if (!container) return;

    container.innerHTML = data
        .map(createMovieCard)
        .join("");
}

// =====================================
// FAVORITES / WATCHLIST
// =====================================

function setupMovieActions(movieId) {

    const favoriteBtn = document.getElementById("favoriteBtn");
    const watchLaterBtn = document.getElementById("watchLaterBtn");

    if (favoriteBtn) {

        favoriteBtn.addEventListener("click", async () => {

            const success = await addFavorite(movieId);

            if (success) {
                favoriteBtn.textContent = "❤️ Added to Favorites";
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
