
// ===========================================
// KIVUSTREAM - TMDB API LAYER
// ===========================================

const TMDB_API_KEY = "8b8937bf3e114fa3502358a4f090c0df";
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getImage(path){

    if(!path){
        return "assets/images/poster.jpg";
    }

    return `${IMAGE_BASE}${path}`;
}

async function getTrending(){

    try{

        const res = await fetch(
            `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_API_KEY}`
        );

        const data = await res.json();

        return data.results || [];

    }catch(err){

        console.error("Trending error:", err);

        return [];

    }

}

async function getLatestMovies(){

    try{

        const res = await fetch(
            `${TMDB_BASE}/movie/now_playing?api_key=${TMDB_API_KEY}`
        );

        const data = await res.json();

        return data.results || [];

    }catch(err){

        console.error("Latest movies error:", err);

        return [];

    }

}

async function getLatestSeries(){

    try{

        const res = await fetch(
            `${TMDB_BASE}/tv/popular?api_key=${TMDB_API_KEY}`
        );

        const data = await res.json();

        return data.results || [];

    }catch(err){

        console.error("Series error:", err);

        return [];

    }

}

async function getTopRated(){

    try{

        const res = await fetch(
            `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_API_KEY}`
        );

        const data = await res.json();

        return data.results || [];

    }catch(err){

        console.error("Top rated error:", err);

        return [];

    }

}

async function searchMovies(query){

    if(!query) return [];

    try{

        const res = await fetch(
            `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
        );

        const data = await res.json();

        return data.results || [];

    }catch(err){

        console.error("Search error:", err);

        return [];

    }

}

async function getMovieDetails(id){

    try{

        const res = await fetch(
            `${TMDB_BASE}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        return await res.json();

    }catch(err){

        console.error("Movie details error:", err);

        return null;

    }

}

async function getSeriesDetails(id){

    try{

        const res = await fetch(
            `${TMDB_BASE}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        return await res.json();

    }catch(err){

        console.error("Series details error:", err);

        return null;

    }

}
window.KivuAPI = {
    getTrending,
    getLatestMovies,
    getLatestSeries,
    getTopRated,
    searchMovies,
    getMovieDetails,
    getSeriesDetails,
    getImage
};
