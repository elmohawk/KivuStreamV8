/* ===========================================
   KIVUSTREAM PRO TMDB API
=========================================== */

async function searchTMDB(query){

    const url =
        `${TMDB_BASE}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

    const res = await fetch(url);

    return await res.json();

}

/* ===========================================
   CACHE
=========================================== */

const cache = new Map();

/* ===========================================
   FETCH JSON
=========================================== */

async function fetchJSON(url) {

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(response.status);
        }

        return await response.json();

    } catch (error) {

        console.error("TMDB:", error);

        return null;

    }

}

/* ===========================================
   SEARCH MOVIE
=========================================== */

async function searchMovie(title) {

    const data = await fetchJSON(

        `${TMDB.BASE}/search/movie?api_key=${TMDB.API_KEY}&query=${encodeURIComponent(title)}`

    );

    return data?.results?.[0] || null;

}

/* ===========================================
   SEARCH TV
=========================================== */

async function searchTV(title) {

    const data = await fetchJSON(

        `${TMDB.BASE}/search/tv?api_key=${TMDB.API_KEY}&query=${encodeURIComponent(title)}`

    );

    return data?.results?.[0] || null;

}

/* ===========================================
   MOVIE DETAILS
=========================================== */

async function getMovie(id) {

    return await fetchJSON(

        `${TMDB.BASE}/movie/${id}?api_key=${TMDB.API_KEY}&append_to_response=videos`

    );

}

/* ===========================================
   TV DETAILS
=========================================== */

async function getTV(id) {

    return await fetchJSON(

        `${TMDB.BASE}/tv/${id}?api_key=${TMDB.API_KEY}&append_to_response=videos`

    );

}

/* ===========================================
   TRAILER
=========================================== */

function trailerKey(videos) {

    if (!videos) return null;

    const trailer = videos.results.find(

        video =>
            video.site === "YouTube" &&
            video.type === "Trailer"

    );

    return trailer?.key || null;

}

/* ===========================================
   ENRICH CONTENT
=========================================== */
async function enrich(item){

    if (!item) return item;

    if (!item.title) return item;

    const cacheKey = `${item.type}-${item.title}`;

    if (cache.has(cacheKey)) {

        return cache.get(cacheKey);

    }

    let searchResult;

    if (item.type === "series") {

        searchResult = await searchTV(item.title);

    } else {

        searchResult = await searchMovie(item.title);

    }

    if (!searchResult) {

        cache.set(cacheKey, item);

        return item;

    }

    let details;

    if (item.type === "series") {

        details = await getTV(searchResult.id);

    } else {

        details = await getMovie(searchResult.id);

    }

    if (!details) {

        cache.set(cacheKey, item);

        return item;

    }

    const enriched = {

        ...item,

        tmdbId: details.id,

        title:

            details.title ||

            details.name ||

            item.title,

        description:

            details.overview ||

            item.description ||

            "",

        overview:

            details.overview ||

            item.description ||

            "",

        poster:

            details.poster_path

                ? TMDB.POSTER + details.poster_path

                : item.image,

        banner:

            details.backdrop_path

                ? TMDB.BACKDROP + details.backdrop_path

                : item.banner ||

                  item.image,

        rating:

            details.vote_average ||

            item.rating ||

            0,

        votes:

            details.vote_count ||

            0,

        year:

            details.release_date ||

            details.first_air_date ||

            "",

        genres:

            details.genres || [],

        language:

            details.original_language ||

            "",

        runtime:

            details.runtime ||

            null,

        seasons:

            details.number_of_seasons ||

            null,

        episodes:

            details.number_of_episodes ||

            null,

        trailer:

            trailerKey(details.videos),

        popularity:

            details.popularity ||

            0

    };

    cache.set(cacheKey, enriched);

    return enriched;

}

/* ===========================================
   ENRICH ARRAY
=========================================== */
async function enrichAll(items = []){

    return Promise.all(

        items.map(enrich)

    );

}

/* ===========================================
   CLEAR CACHE
=========================================== */
function clearCache(){

    cache.clear();

}
window.enrich = enrich;
window.enrichAll = enrichAll;
window.clearCache = clearCache;
