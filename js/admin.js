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
    const videoUrl = document.getElementById("videoUrl").value.trim();

    if (!tmdbId) {
        alert("Enter TMDB ID");
        return;
    }

    // Fetch movie from TMDB
    const movie = await getMovieDetails(tmdbId);

    if (!movie) {
        alert("Movie not found on TMDB");
        return;
    }

    const trailer =
        movie.videos?.results?.find(
            v => v.site === "YouTube" && v.type === "Trailer"
        );

    const { error } = await supabaseClient
        .from("movies")
        .insert([{
            tmdb_id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            runtime: movie.runtime,
            genres: movie.genres,
            featured: featured,
            trailer_key: trailer?.key || null,
            video_url: videoUrl,
            is_active: true
        }]);

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    alert("Movie added successfully!");
    loadMovies();
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
