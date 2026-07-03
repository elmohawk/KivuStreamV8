const params = new URLSearchParams(window.location.search);

const movieId = params.get("id");

async function loadWatchPage(){

    if(!movieId){

        window.location.href = "index.html";

        return;

    }

    const movie = await KivuAPI.getMovieDetails(movieId);

    if(!movie){

        alert("Movie not found.");

        return;

    }

    document.getElementById("movieTitle").textContent = movie.title;

    document.getElementById("movieOverview").textContent = movie.overview;

    document.getElementById("movieMeta").innerHTML = `

        <span>⭐ ${movie.vote_average.toFixed(1)}</span>

        <span>${movie.release_date}</span>

        <span>${movie.runtime} min</span>

        <span>${movie.genres.map(g=>g.name).join(", ")}</span>

    `;

    /*
      Replace this with your own streaming URL
      from Supabase later.
    */

    document.getElementById("videoPlayer").src =
        "https://www.youtube.com/embed/dQw4w9WgXcQ";

    const related = await KivuAPI.getTrending();

    renderMovies("relatedMovies", related.slice(0,8));

}

loadWatchPage();
