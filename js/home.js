// =====================================
// HOME.JS (SUPABASE VERSION)
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    await Promise.all([
        loadFeatured(),
        loadPopularMovies(),
        loadTopRated(),
        loadSeries()
    ]);

});

// =====================================
// Generic Loader
// =====================================

async function loadSection(containerId, options = {}) {

    let query = supabaseClient
        .from("movies")
        .select("*")
        .eq("is_active", true);

    if (options.featured !== undefined) {
        query = query.eq("featured", options.featured);
    }

    if (options.category) {
        query = query.eq("category", options.category);
    }

    if (options.orderBy) {
        query = query.order(
            options.orderBy,
            { ascending: options.ascending ?? false }
        );
    }

    if (options.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error(`${containerId}:`, error);
        return;
    }

    renderMovies(containerId, data);

}

// =====================================
// Featured
// =====================================

async function loadFeatured() {

    await loadSection("trendingMovies", {
        featured: true,
        orderBy: "featured_order",
        ascending: true,
        limit: 12
    });

}

// =====================================
// Latest Movies
// =====================================

async function loadPopularMovies() {

    await loadSection("popularMovies", {
        category: "movie",
        orderBy: "created_at",
        ascending: false,
        limit: 12
    });

}

// =====================================
// Top Rated
// =====================================

async function loadTopRated() {

    await loadSection("topRatedMovies", {
        orderBy: "vote_average",
        ascending: false,
        limit: 12
    });

}

// =====================================
// Series
// =====================================

async function loadSeries() {

    await loadSection("popularSeries", {
        category: "series",
        orderBy: "created_at",
        ascending: false,
        limit: 12
    });

}

// =====================================
// Render Cards
// =====================================

function renderMovies(containerId, movies) {

    const container = document.getElementById(containerId);

    if (!container) return;

    if (!movies || movies.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No content available.</h3>
            </div>
        `;

        return;

    }

    container.innerHTML = movies
        .map(createMovieCard)
        .join("");

}
