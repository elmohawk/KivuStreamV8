// =====================================
// HOME.JS (SUPABASE VERSION)
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    await Promise.all([
        loadHero(),
        loadFeatured(),
        loadPopularMovies(),
        loadTopRated(),
        loadSeries(),
        loadLatestMovies(),
        loadTranslators(),
        loadCategories()
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
// =====================================
// Hero
// =====================================

async function loadHero() {

   const { data, error } = await supabaseClient
  .from("movies")
  .select("*")
  .eq("id", id)
  .maybeSingle();

if (error) {
    console.error(error);
    return;
}

if (!data) {
    console.warn("Movie not found");
    return;
}

    if (error || !data) return;

    document.getElementById("heroTitle").textContent = data.title;
    document.getElementById("heroOverview").textContent = data.overview;
    document.getElementById("heroBanner").style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;
    document.getElementById("watchNowBtn").href =
        `watch.html?id=${data.id}`;
}

// =====================================
// Translators
// =====================================

async function loadTranslators() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("translator");

    if (error) {
        console.error(error);
        return;
    }

    const translators = [...new Set(
        data
            .map(item => item.translator)
            .filter(Boolean)
    )];

    const container = document.getElementById("translatorSlider");

    if (!container) return;

    container.innerHTML = translators.map(name => {

        const initials = name
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        return `
            <div class="translator-card">
                <div class="translator-avatar">${initials}</div>
                <div class="translator-name">${name}</div>
            </div>
        `;

    }).join("");

}

// =====================================
// Latest Movies
// =====================================

async function loadLatestMovies() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById("latestMovies");

    if (!container) return;

    container.innerHTML = data.map(createMovieCard).join("");

}

// =====================================
// Categories
// =====================================

async function loadCategories() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("category");

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById("categoryList");

    if (!container) return;

    const categories = [...new Set(
        data
            .map(item => item.category)
            .filter(Boolean)
    )];

    container.innerHTML = categories.map(category => `
        <a class="category-card"
           href="movies.html?category=${encodeURIComponent(category)}">
            ${category}
        </a>
    `).join("");

}
