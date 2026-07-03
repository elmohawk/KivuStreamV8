function createMovieCard(movie){

    return `
    
    <div class="movie-card">

        <div class="movie-poster">

            <img src="${KivuAPI.getImage(movie.poster_path)}" alt="${movie.title}">

            <button class="favorite-btn">
                <i class="ri-heart-line"></i>
            </button>

            <div class="movie-rating">
                ⭐ ${movie.vote_average?.toFixed(1) || "0.0"}
            </div>

            <div class="movie-overlay">
                <button class="play-btn">
                    <i class="ri-play-fill"></i>
                </button>
            </div>

        </div>

        <div class="movie-info">

            <h3>${movie.title || movie.name}</h3>

            <div class="movie-meta">

                <span>${movie.release_date?.slice(0,4) || "--"}</span>

                <span>${movie.media_type || "Movie"}</span>

            </div>

        </div>

    </div>

    `;

}
function renderMovies(containerId, movies){

    const container = document.getElementById(containerId);

    if(!container) return;

    container.innerHTML = movies.map(createMovieCard).join("");

}

async function loadTrending(){

    const data = await KivuAPI.getTrending();

    renderMovies("trendingMovies", data);

}

async function loadLatestMovies(){

    const data = await KivuAPI.getLatestMovies();

    renderMovies("latestMovies", data);

}

async function loadSeries(){

    const data = await KivuAPI.getLatestSeries();

    renderMovies("latestSeries", data);

}

async function loadTopRated(){

    const data = await KivuAPI.getTopRated();

    renderMovies("topRatedMovies", data);

}

async function initHomePage(){

    try{

        await Promise.all([
            loadTrending(),
            loadLatestMovies(),
            loadSeries(),
            loadTopRated()
        ]);

        console.log("KivuStream UI Loaded 🚀");

    }catch(err){

        console.error("UI Init Error:", err);

    }

}
document.addEventListener("DOMContentLoaded", initHomePage);
document.addEventListener("click", (e)=>{

    if(e.target.closest(".favorite-btn")){

        const btn = e.target.closest(".favorite-btn");

        btn.classList.toggle("active");

        btn.innerHTML = btn.classList.contains("active")
            ? '<i class="ri-heart-fill"></i>'
            : '<i class="ri-heart-line"></i>';

    }

});
