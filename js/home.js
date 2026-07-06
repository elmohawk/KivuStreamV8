// =====================================
// HOME.JS (SUPABASE VERSION)
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

await Promise.all([
    loadFeatured(),
    loadPopularMovies(),
    loadTopRated(),
    loadSeries(),
    loadLatestMovies()
]);
}    
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
async function loadHero() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("featured", true)
        .eq("is_active", true)
        .limit(1)
        .single();

    if (error || !data) return;

    document.getElementById("heroTitle").textContent =
        data.title;

    document.getElementById("heroOverview").textContent =
        data.overview;

    document.getElementById("heroBanner").style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;

    document.getElementById("watchNowBtn").href =
        `watch.html?id=${data.id}`;
}
document.addEventListener("DOMContentLoaded", async () => {

    await loadHero();


async function loadTranslators() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("translator");

    if (error) {

        console.error(error);
        return;

    }

    // Remove duplicates and empty values
    const translators = [...new Set(
        data
            .map(item => item.translator)
            .filter(Boolean)
    )];

    const container = document.getElementById("translatorSlider");

    container.innerHTML = translators.map(name => {

        const initials = name
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0,2)
            .toUpperCase();

        return `
            <div class="translator-card">

                <div class="translator-avatar">
                    ${initials}
                </div>

                <div class="translator-name">
                    ${name}
                </div>

            </div>
        `;

    }).join("");

}
await loadTranslators();

    async function loadLatestMovies(){

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("is_active", true)
        .order("created_at",{ascending:false})
        .limit(20);

    if(error){

        console.error(error);
        return;

    }

    document.getElementById("latestMovies").innerHTML =
        data.map(createMovieCard).join("");

}
async function loadCategories(){

const {data}=await supabaseClient

.from("movies")

.select("category");

const categories=[

...new Set(

data
.map(i=>i.category)
.filter(Boolean)

)

];

document
.getElementById("categoryList")
.innerHTML=

categories
.map(category=>`

<a
class="category-card"
href="movies.html?category=${category}">

${category}

</a>

`)

.join("");

}
