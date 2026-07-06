
function createMovieCard(movie){

    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "assets/poster.jpg";

    const year = movie.release_date
        ? movie.release_date.substring(0,4)
        : "";

    const rating = movie.vote_average
        ? movie.vote_average.toFixed(1)
        : "N/A";

    return `

<a href="watch.html?id=${movie.id}" class="movie-card">

    <div class="movie-poster">

        <img src="${poster}" alt="${movie.title}">

        <span class="badge-year">
            ${year}
        </span>

        <span class="badge-translator">
            ${movie.translator || "Sub"}
        </span>

        <div class="movie-overlay">

            <button class="play-circle">
                ▶
            </button>

        </div>

    </div>

    <div class="movie-info">

        <h3>${movie.title}</h3>

        <p>

            ⭐ ${rating}

        </p>

    </div>

</a>

`;

}
function renderMovie(movie) {

    const hero = document.getElementById("movieHero");

    const backdrop = movie.backdrop_path
        ? `${CONFIG.TMDB_IMAGE_URL}${movie.backdrop_path}`
        : "assets/poster.jpg";

    const poster = movie.poster_path
        ? `${CONFIG.TMDB_IMAGE_URL}${movie.poster_path}`
        : "assets/poster.jpg";

    const title = movie.title || "Untitled";

    const overview = movie.overview || "No description available.";

    const rating = movie.vote_average
        ? Number(movie.vote_average).toFixed(1)
        : "N/A";

    const date = movie.release_date || "Unknown";

    const runtime = movie.runtime || "N/A";

    const genres = movie.genres || "Unknown";

    const translator = movie.translator || "Unknown";

    const quality = movie.quality || "HD";

    const trailer = movie.trailer_key
        ? `
        <div class="trailer-section">
            <h2>🎬 Trailer</h2>

            <iframe
                width="100%"
                height="500"
                src="https://www.youtube.com/embed/${movie.trailer_key}"
                allowfullscreen>
            </iframe>
        </div>
        `
        : "";

    hero.innerHTML = `
<section class="watch-hero"
style="background-image:url('${backdrop}')">

<div class="watch-overlay">

<div class="container">

<div class="watch-content">

<div class="watch-poster">

<img src="${poster}" alt="${title}">

</div>

<div class="watch-details">

<h1>${title}</h1>

<p class="overview">
${overview}
</p>

<div class="movie-meta">

<span>⭐ ${rating}</span>

<span>📅 ${date}</span>

<span>🎞 ${quality}</span>

<span>⏱ ${runtime} min</span>

</div>

<p>

<strong>Genres:</strong>

${genres}

</p>

<p>

<strong>Translator:</strong>

${translator}

</p>

<div class="watch-buttons">

<button
id="favoriteBtn"
class="btn btn-primary">

❤️ Favorite

</button>

<button
id="watchLaterBtn"
class="btn btn-secondary">

➕ Watch Later

</button>

</div>

${createDownloadButtons(movie)}

</div>

</div>

${trailer}

</div>

</div>

</section>
`;

}
function createDownloadButtons(movie) {

    if (!movie.download_links)
        return "";

    let links = movie.download_links;

    // Handle JSON string if necessary
    if (typeof links === "string") {

        try {
            links = JSON.parse(links);
        } catch (e) {
            return "";
        }

    }

    let html = `
    <div class="download-section">

        <h2>⬇ Download</h2>

        <div class="download-buttons">
    `;

    Object.entries(links).forEach(([quality, url]) => {

        html += `
            <a
                href="${url}"
                target="_blank"
                class="btn btn-success">

                ${quality}

            </a>
        `;

    });

    html += `
        </div>
    </div>
    `;

    return html;

}
function createDownloadButtons(movie){

    if(!movie.download_links)
        return "";

    let html="<div class='downloads'>";

    Object.entries(movie.download_links)
    .forEach(([quality,url])=>{

        html+=`

<a
href="${url}"
target="_blank"
class="btn btn-secondary">

⬇ ${quality}

</a>

`;

    });

    html+="</div>";

    return html;

}
