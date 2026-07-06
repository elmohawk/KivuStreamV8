// ======================================
// KivuStream Search & Filters
// ======================================

let currentPage = 1;
const pageSize = 24;

document.addEventListener("DOMContentLoaded", () => {

    loadMovies();

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            currentPage = 1;
            loadMovies();
        });
    }

    const searchBox = document.getElementById("searchBox");
    if (searchBox) {
        searchBox.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                currentPage = 1;
                loadMovies();
            }
        });
    }

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            currentPage++;
            loadMovies(true);
        });
    }

});

// ======================================
// LOAD MOVIES
// ======================================

async function loadMovies(append = false) {

    let query = supabaseClient
        .from("movies")
        .select("*")
        .eq("is_active", true);

    // URL Filters
    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");
    const country = params.get("country");
    const translator = params.get("translator");

    if (category)
        query = query.eq("category", category);

    if (country)
        query = query.eq("country", country);

    if (translator)
        query = query.eq("translator", translator);

    // Search
    const searchInput = document.getElementById("searchBox");

    if (searchInput) {

        const keyword = searchInput.value.trim();

        if (keyword !== "") {

            query = query.ilike("title", `%${keyword}%`);

        }

    }

    // Pagination
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
        .order("created_at", { ascending: false })
        .range(from, to);

    const { data, error } = await query;

    if (error) {

        console.error(error);
        return;

    }

    const grid = document.getElementById("moviesGrid");

    if (!grid) return;

    if (!append)
        grid.innerHTML = "";

    if (!data.length && !append) {

        grid.innerHTML = `

        <div class="empty-state">

            <h2>No movies found.</h2>

        </div>

        `;

        return;

    }

    grid.innerHTML += data
        .map(createMovieCard)
        .join("");

}
