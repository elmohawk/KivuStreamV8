// ======================================
// SEARCH.JS (SUPABASE VERSION)
// ======================================

const PAGE_SIZE = 24;

let currentPage = 0;
let currentQuery = "";

document.addEventListener("DOMContentLoaded", () => {

    loadMovies();

    document
        .getElementById("searchBtn")
        .addEventListener("click", search);

    document
        .getElementById("loadMoreBtn")
        .addEventListener("click", loadMore);

    document
        .getElementById("searchBox")
        .addEventListener("keypress", (e) => {

            if (e.key === "Enter") {
                search();
            }

        });

});

async function loadMovies() {

    let query = supabaseClient
        .from("movies")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (currentQuery !== "") {

        query = query.ilike("title", `%${currentQuery}%`);

    }

    query = query.range(
        currentPage * PAGE_SIZE,
        (currentPage * PAGE_SIZE) + PAGE_SIZE - 1
    );

    const { data, error } = await query;

    if (error) {

        console.error("Supabase Error:", error);
        return;

    }

    const grid = document.getElementById("moviesGrid");

    if (currentPage === 0) {

        grid.innerHTML = "";

    }

    if (!data || data.length === 0) {

        if (currentPage === 0) {

            grid.innerHTML = `
                <div class="empty-state">
                    <h2>No movies found.</h2>
                </div>
            `;

        }

        document.getElementById("loadMoreBtn").style.display = "none";
        return;

    }

    grid.innerHTML += data
        .map(createMovieCard)
        .join("");

    // Hide Load More if fewer than PAGE_SIZE returned
    document.getElementById("loadMoreBtn").style.display =
        data.length < PAGE_SIZE ? "none" : "inline-block";

}

function search() {

    currentQuery = document
        .getElementById("searchBox")
        .value
        .trim();

    currentPage = 0;

    loadMovies();

}

function loadMore() {

    currentPage++;

    loadMovies();

}
