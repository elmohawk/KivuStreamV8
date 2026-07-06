async function loadMovies(append = false) {

    const grid = document.getElementById("moviesGrid");
    if (!grid) return;

    if (!append) {
        grid.innerHTML = `<div class="loading">Loading...</div>`;
    }

    let query = supabaseClient
        .from("movies")
        .select("*")
        .eq("is_active", true);

    // URL filters
    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");
    const country = params.get("country");
    const translator = params.get("translator");

    if (category) query = query.eq("category", category);
    if (country) query = query.eq("country", country);
    if (translator) query = query.eq("translator", translator);

    // SEARCH (IMPROVED)
    const searchBox = document.getElementById("searchBox");
    const keyword = searchBox?.value?.trim();

    if (keyword && keyword.length > 0) {
        query = query.or(
            `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
        );
    }

    // PAGINATION
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
        .order("created_at", { ascending: false })
        .range(from, to);

    const { data, error } = await query;

    if (error) {
        console.error(error);
        grid.innerHTML = `<div class="empty-state">Error loading movies</div>`;
        return;
    }

    if (!data || data.length === 0) {

        if (!append) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h2>No results found</h2>
                    <p>Try another keyword</p>
                </div>
            `;
        }

        return;
    }

    if (!append) grid.innerHTML = "";

    grid.innerHTML += data.map(createMovieCard).join("");
}
let searchTimer = null;

const searchBox = document.getElementById("searchBox");

if (searchBox) {

    searchBox.addEventListener("input", () => {

        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {

            currentPage = 1;
            loadMovies();

        }, 400); // debounce

    });

}
