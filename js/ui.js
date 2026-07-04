function createMovieCard(movie) {

    const poster = movie.poster_path
        ? `${CONFIG.TMDB_IMAGE_URL}${movie.poster_path}`
        : "assets/images/no-image.png";

    return `

        <div class="movie-card">

            <a href="watch.html?id=${movie.id}">

                <img
                    src="${poster}"
                    alt="${movie.title}"
                    loading="lazy"
                >

                <div class="movie-info">

                    <h3>${movie.title}</h3>

                    <p class="rating">
                        ⭐ ${movie.vote_average.toFixed(1)}
                    </p>

                    <small>
                        ${movie.release_date || "Coming Soon"}
                    </small>

                </div>

            </a>

        </div>

    `;
}
function renderMovie(movie, credits, videos) {

    const hero = document.getElementById("movieHero");

    const backdrop = movie.backdrop_path
        ? `${CONFIG.TMDB_IMAGE_URL}${movie.backdrop_path}`
        : "assets/images/no-image.png";

    const trailer = videos.results.find(
        video => video.site === "YouTube" && video.type === "Trailer"
    );

    const cast = credits.cast
        .slice(0, 6)
        .map(actor => actor.name)
        .join(", ");

    hero.innerHTML = `

<section class="watch-hero"
style="background-image:url('${backdrop}')">

<div class="watch-overlay">

<div class="container">

<h1>${movie.title}</h1>

<p>${movie.overview}</p>

<p>

⭐ ${movie.vote_average.toFixed(1)}

•

📅 ${movie.release_date}

•

⏱ ${movie.runtime} min

</p>

<p>

<strong>Genres:</strong>

${movie.genres.map(g=>g.name).join(", ")}

</p>

<p>

<strong>Cast:</strong>

${cast}

</p>

<div class="watch-buttons">

<button class="btn btn-primary">
❤️ Add to Favorites
</button>

<button class="btn btn-secondary">
➕ Watch Later
</button>

</div>

${
trailer
?
`<iframe
width="100%"
height="500"
src="https://www.youtube.com/embed/${trailer.key}"
allowfullscreen>
</iframe>`
:
""
}

</div>

</div>

</section>

`;

}
