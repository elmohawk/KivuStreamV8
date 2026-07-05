
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

/* ================= HOME ================= */

const getTrendingMovies = () =>
    request("/trending/movie/week");

const getPopularMovies = () =>
    request("/movie/popular");

const getTopRatedMovies = () =>
    request("/movie/top_rated");

const getUpcomingMovies = () =>
    request("/movie/upcoming");

const getPopularSeries = () =>
    request("/tv/popular");

/* ================= MOVIE ================= */

const getMovieDetails = (id) =>
    request(`/movie/${id}`, "&append_to_response=videos,credits,recommendations");

/* ================= SEARCH ================= */

const searchMovies = (query) =>
    request("/search/movie", `&query=${encodeURIComponent(query)}`);

const searchMoviesPage = (query, page = 1) =>
    request("/search/movie", `&query=${encodeURIComponent(query)}&page=${page}`);

/* ================= PAGINATION ================= */

const getPopularMoviesPage = (page = 1) =>
    request("/movie/popular", `&page=${page}`);
const getSeriesDetails = (id) =>
    request(`/tv/${id}`);

const getPopularSeriesPage = (page = 1) =>
    request("/tv/popular", `&page=${page}`);

const searchSeries = (query) =>
    request("/search/tv", `&query=${encodeURIComponent(query)}`);

const searchSeriesPage = (query, page = 1) =>
    request("/search/tv", `&query=${encodeURIComponent(query)}&page=${page}`);

const getSeriesRecommendations = (id) =>
    request(`/tv/${id}/recommendations`);
async function getTmdbDetails(id, type = "movie") {

    if (!id) {
        console.warn("Missing TMDB ID");
        return null;
    }

    const endpoint =
        type === "series"
            ? `/tv/${id}`
            : `/movie/${id}`;

    return await request(
        endpoint,
        "&append_to_response=videos,credits"
    );
}
