document.addEventListener("DOMContentLoaded", async () => {
    await requireAuth();

    // Later we'll also check if the user is an administrator
    loadAdminDashboard();
});
async function protectAdmin(){

    const { data } = await supabase.auth.getUser();

    if(!data.user){

        alert("Login required");
        window.location.href = "login.html";

    }

}

protectAdmin();
// ===========================================
// ADMIN PANEL
// ===========================================
// ADD MOVIE FROM TMDB
async function addMovie() {

    const tmdbId = document.getElementById("tmdbId").value.trim();
    const featured = document.getElementById("featured").checked;
    const category = document.getElementById("category").value || "movie";

    if (!tmdbId) {
        alert("Enter TMDB ID");
        return;
    }

    await importFromTMDB(tmdbId, category, featured);
    loadMovies();
}
}
// LOAD ALL MOVIES
async function loadMovies() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById("movieList");
    container.innerHTML = "";

    data.forEach(movie => {

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "assets/poster.jpg";

        const div = document.createElement("div");

        div.className = "admin-movie";

        div.innerHTML = `
            <img src="${poster}" width="80">

            <div>
                <h3>${movie.title}</h3>
                <p>⭐ ${movie.vote_average}</p>
                <p>${movie.release_date}</p>
                <p>${movie.featured ? "Featured" : "Normal"}</p>
            </div>

            <button onclick="deleteMovie('${movie.id}')">
                Delete
            </button>
        `;

        container.appendChild(div);

    });

}

// DELETE MOVIE
async function deleteMovie(id){
await supabaseClient
    .from("movies")
        .delete()
        .eq("id", id);

    alert("Deleted");

    loadMovies();

}


// INIT
loadMovies();
async function importFromTMDB(tmdbId, category = "movie", featured = false) {

    // 1. Fetch from TMDB
    const tmdb = await getTmdbDetails(tmdbId, category);

    if (!tmdb) {
        alert("TMDB not found");
        return;
    }

    // 2. Prepare data for Supabase
    const movieData = {
        tmdb_id: tmdb.id,
        title: tmdb.title || tmdb.name,
        overview: tmdb.overview,
        poster_path: tmdb.poster_path,
        backdrop_path: tmdb.backdrop_path,
        vote_average: tmdb.vote_average,
        release_date: tmdb.release_date || tmdb.first_air_date,
        runtime: tmdb.runtime || null,
        genres: tmdb.genres,
        category: category,
        featured: featured,
        is_active: true
    };

    // 3. Check if already exists (avoid duplicates)
    const { data: existing } = await supabaseClient
        .from("movies")
        .select("id")
        .eq("tmdb_id", tmdbId)
        .maybeSingle();

    if (existing) {
        alert("Movie already exists in database");
        return;
    }

    // 4. Insert into Supabase
    const { error } = await supabaseClient
        .from("movies")
        .insert([movieData]);

    if (error) {
        console.error(error);
        alert("Failed to import movie");
        return;
    }

    alert("Movie imported successfully!");
}

async function searchTMDBAdmin() {

    const query = document.getElementById("tmdbSearchInput").value.trim();

    if (!query) return;

    const movies = await searchMovies(query); // from your api.js
    const series = await searchSeries(query);

    const results = [
        ...(movies?.results || []),
        ...(series?.results || [])
    ];

    const container = document.getElementById("tmdbResults");

    container.innerHTML = results.map(item => {

        const title = item.title || item.name;
        const poster = item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : "assets/poster.jpg";

        return `
            <div class="tmdb-item">

                <img src="${poster}" />

                <div>
                    <h4>${title}</h4>
                    <button onclick="previewTMDB(${item.id}, '${item.media_type || 'movie'}')">
                        Preview
                    </button>

                    <button onclick="importTMDB(${item.id}, '${item.media_type || 'movie'}')">
                        Import
                    </button>
                </div>

            </div>
        `;
    }).join("");
}

async function previewTMDB(id, type = "movie") {

    const data = await getTmdbDetails(id, type);

    const container = document.getElementById("tmdbPreview");

    container.innerHTML = `
        <div class="preview-box">

            <h2>${data.title || data.name}</h2>

            <img src="https://image.tmdb.org/t/p/w300${data.poster_path}" />

            <p>${data.overview}</p>

            <p>⭐ ${data.vote_average}</p>
            <p>📅 ${data.release_date || data.first_air_date}</p>

        </div>
    `;
}

async function importTMDB(id, type = "movie") {

    const featured = false;

    // 1. Fetch full TMDB data
    const tmdb = await getTmdbDetails(id, type);

    if (!tmdb) {
        alert("Failed to fetch TMDB data");
        return;
    }

    // 2. Build Supabase object
    const movieData = {
        tmdb_id: tmdb.id,
        title: tmdb.title || tmdb.name,
        overview: tmdb.overview,
        poster_path: tmdb.poster_path,
        backdrop_path: tmdb.backdrop_path,
        vote_average: tmdb.vote_average,
        release_date: tmdb.release_date || tmdb.first_air_date,
        category: type === "tv" ? "series" : "movie",
        featured: featured,
        is_active: true
    };

    // 3. Prevent duplicates
    const { data: existing } = await supabaseClient
        .from("movies")
        .select("id")
        .eq("tmdb_id", id)
        .maybeSingle();

    if (existing) {
        alert("Already imported");
        return;
    }

    // 4. Insert into Supabase
    const { error } = await supabaseClient
        .from("movies")
        .insert([movieData]);

    if (error) {
        console.error(error);
        alert("Import failed");
        return;
    }

    alert("Imported successfully!");
}
