document.addEventListener("DOMContentLoaded", async () => {

    await loadFeatured();
    await loadPopular();
    await loadTopRated();
    await loadSeries();

});

async function loadFeatured(){

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("featured", true);

    if (error) {
        console.error(error);
        return;
    }

    renderMovies("trendingMovies", {
        results: data
    });

}

async function loadPopular() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("category", "movie")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    renderMovies("popularMovies", {
        results: data
    });

}
async function loadTopRated() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .order("vote_average", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    renderMovies("topRatedMovies", {
        results: data
    });

}

async function loadSeries() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
       .eq("category", "series")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    renderMovies("popularSeries", {
        results: data
    });

}

function renderMovies(id, data) {

    if (!data) return;

    const container = document.getElementById(id);

    if (!container) return;

    container.innerHTML = data.results
        .slice(0, 12)
        .map(createMovieCard)
        .join("");

}
