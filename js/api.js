// js/api.js

const API_KEY = CONFIG.TMDB_API_KEY;
const BASE_URL = CONFIG.TMDB_BASE_URL;

async function request(endpoint, params = "") {

    const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}${params}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        return await response.json();

    } catch (error) {

        console.error("TMDB Error:", error);

        return null;
    }
}

// Home
const getTrendingMovies = () => request("/trending/movie/week");

const getPopularMovies = () => request("/movie/popular");

const getTopRatedMovies = () => request("/movie/top_rated");

const getUpcomingMovies = () => request("/movie/upcoming");

const getPopularSeries = () => request("/tv/popular");

// Movies
const getMovie = (id) => request(`/movie/${id}`);

const getMovieCredits = (id) =>
    request(`/movie/${id}/credits`);

const getMovieVideos = (id) =>
    request(`/movie/${id}/videos`);

const getRecommendations = (id) =>
    request(`/movie/${id}/recommendations`);

const searchMovies = (query) =>
    request(`/search/movie`, `&query=${encodeURIComponent(query)}`);
