
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
async function loadMovie(id){

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

    if(error){

        console.error(error);

        return;

    }

    renderMovie(data);

    setupMovieActions(id);

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
