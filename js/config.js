
/* ===========================================
   KIVUSTREAM PRO CONFIG
=========================================== */

export const CONFIG = {

    APP_NAME: "KivuStream",

    VERSION: "2.0.0",

    MOVIES_PER_ROW: 12,

    HERO_INTERVAL: 6000,

    PLACEHOLDER: "./assets/logo.png"

};

/* ===========================================
   SUPABASE
=========================================== */

export const SUPABASE = {

    URL: "https://exjgejujfxejjlbfizgz.supabase.co",

    KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4amdlanVqZnhlampsYmZpemd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTQzMTQsImV4cCI6MjA5NDA5MDMxNH0.CWUYLk4qJfriIYXWScB7wcHHVTCuz0SGDhWUV3tMR1Y"

};

/* ===========================================
   TMDB
=========================================== */

export const TMDB = {

    API_KEY: "8b8937bf3e114fa3502358a4f090c0df",

    BASE: "https://api.themoviedb.org/3",

    POSTER: "https://image.tmdb.org/t/p/w500",

    BACKDROP: "https://image.tmdb.org/t/p/original"

};

/* ===========================================
   CATEGORIES
=========================================== */

export const HOME_SECTIONS = [

    {
        id: "featuredMovies",
        title: "Featured",
        type: "featured"
    },

    {
        id: "latestMovies",
        title: "Latest Movies",
        type: "movie"
    },

    {
        id: "popularSeries",
        title: "TV Series",
        type: "series"
    },

    {
        id: "actionMovies",
        title: "Action",
        category: "Action"
    },

    {
        id: "romanceMovies",
        title: "Romance",
        category: "Romance"
    },

    {
        id: "comedyMovies",
        title: "Comedy",
        category: "Comedy"
    },

    {
        id: "crimeMovies",
        title: "Crime",
        category: "Crime"
    },

    {
        id: "animationMovies",
        title: "Animation",
        category: "Animation"
    },

    {
        id: "indianMovies",
        title: "Indian",
        category: "Indian"
    }

];
