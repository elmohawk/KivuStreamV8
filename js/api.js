
// ===========================================
// KIVUSTREAM - TMDB API LAYER
// ===========================================

// BASE CONFIG
const TMDB_API_KEY = "8b8937bf3e114fa3502358a4f090c0df";

const TMDB_BASE = "https://api.themoviedb.org/3";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";


// ===========================================
// GET MOVIE DETAILS
// ===========================================
async function getMovieDetails(tmdbId){

    try {

        const res = await fetch(
            `${TMDB_BASE}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        const data = await res.json();

        return data;

    } catch (error) {

        console.error("Movie fetch error:", error);

        return null;

    }

}


// ===========================================
// GET SERIES DETAILS
// ===========================================
async function getSeriesDetails(tmdbId){

    try {

        const res = await fetch(
            `${TMDB_BASE}/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        const data = await res.json();

        return data;

    } catch (error) {

        console.error("Series fetch error:", error);

        return null;

    }

}


// ===========================================
// IMAGE HELPER
// ===========================================
function getImage(path){

    if(!path) return "assets/images/poster.jpg";

    return `${IMAGE_BASE}${path}`;

}


// ===========================================
// SEARCH MOVIES
// ===========================================
async function searchMovies(query){

    try {

        const res = await fetch(
            `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        return data.results || [];

    } catch (error) {

        console.error("Search error:", error);

        return [];

    }

}


// ===========================================
// TRENDING MOVIES
// ===========================================
async function getTrending(){

    try {

        const res = await fetch(
            `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_API_KEY}`
        );

        const data = await res.json();

        return data.results || [];

    } catch (error) {

        console.error("Trending error:", error);

        return [];

    }

}


// ===========================================
// TOP RATED MOVIES
// ===========================================
async function getTopRated(){

    try {

        const res = await fetch(
            `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_API_KEY}`
        );

        const data = await res.json();

        return data.results || [];

    } catch (error) {

        console.error("Top Rated error:", error);

        return [];

    }

}


// ===========================================
// POPULAR MOVIES
// ===========================================
async function getPopular(){

    try {

        const res = await fetch(
            `${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}`
        );

        const data = await res.json();

        return data.results || [];

    } catch (error) {

        console.error("Popular error:", error);

        return [];

    }

}
