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


// ADD MOVIE BY TMDB ID
async function addMovie(){

    const tmdbId = document.getElementById("tmdbId").value;
    const featured = document.getElementById("featured").checked;

    if(!tmdbId){
        alert("Enter TMDB ID");
        return;
    }

    const { error } = await supabase
        .from("movies")
        .insert([
            {
                tmdb_id: parseInt(tmdbId),
                featured: featured
            }
        ]);

    if(error){
        console.error(error);
        return;
    }

    alert("Movie added successfully!");
    loadMovies();

}


// LOAD ALL MOVIES
async function loadMovies(){

    const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });

    const container = document.getElementById("movieList");

    container.innerHTML = "";

    data.forEach(movie => {

        const div = document.createElement("div");

        div.classList.add("admin-movie");

        div.innerHTML = `
            <p>TMDB ID: ${movie.tmdb_id}</p>
            <p>Featured: ${movie.featured}</p>
            <button onclick="deleteMovie('${movie.id}')">Delete</button>
        `;

        container.appendChild(div);

    });

}


// DELETE MOVIE
async function deleteMovie(id){

    await supabase
        .from("movies")
        .delete()
        .eq("id", id);

    alert("Deleted");

    loadMovies();

}


// INIT
loadMovies();
