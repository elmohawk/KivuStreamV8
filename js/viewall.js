const SUPABASE_URL = "https://exjgejujfxejjlbfizgz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4amdlanVqZnhlampsYmZpemd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTQzMTQsImV4cCI6MjA5NDA5MDMxNH0.CWUYLp4qJfriIYXWScB7wcHHVTCuz0SGDhWUV3tMR1Y";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const grid = document.getElementById("contentGrid");

let page = 0;
const limit = 24;

async function loadMovies() {

    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error(error);
        return;
    }

    renderMovies(data);

    page++;
}

function renderMovies(movies) {

    movies.forEach(movie => {

        grid.insertAdjacentHTML(
            "beforeend",
            `
            <a href="watch.html?id=${movie.id}" class="movie-card">

                <img
                    src="${movie.poster_url}"
                    alt="${movie.title}">

                <div class="movie-info">

                    <h3>${movie.title}</h3>

                    <div class="meta">
                        <span>${movie.release_year}</span>
                        <span>⭐ ${movie.rating || "N/A"}</span>
                    </div>

                </div>

            </a>
            `
        );
    });
}

loadMovies();

document
.getElementById("loadMoreBtn")
.addEventListener("click", loadMovies);
