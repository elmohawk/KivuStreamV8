const API = {
    async fetchData(endpoint) {
        try {
            const response = await fetch(
                `${CONFIG.TMDB_BASE_URL}${endpoint}?api_key=${CONFIG.TMDB_API_KEY}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    getTrendingMovies() {
        return this.fetchData("/trending/movie/week");
    },

    getPopularMovies() {
        return this.fetchData("/movie/popular");
    },

    getPopularSeries() {
        return this.fetchData("/tv/popular");
    },

    getMovie(id) {
        return this.fetchData(`/movie/${id}`);
    },

    searchMovies(query) {
        return fetch(
            `${CONFIG.TMDB_BASE_URL}/search/movie?api_key=${CONFIG.TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        ).then(res => res.json());
    }
};
