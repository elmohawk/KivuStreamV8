async function loadMovies(append = false) {

    const grid = document.getElementById("moviesGrid");
    if (!grid) return;

    if (!append) {
        grid.innerHTML = `<div class="loading">Loading...</div>`;
    }

    let query = supabaseClient
        .from("movies")
        .select("*")
        .eq("is_active", true);

    // URL filters
    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");
    const country = params.get("country");
    const translator = params.get("translator");

    if (category) query = query.eq("category", category);
    if (country) query = query.eq("country", country);
    if (translator) query = query.eq("translator", translator);

    // SEARCH (IMPROVED)
    const searchBox = document.getElementById("searchBox");
  const keyword = searchBox?.value?.trim();

let query = supabaseClient
    .from("movies")
    .select("*")
    .eq("is_active", true);

// AI MODE ON
if (keyword) {

    const ai = parseAIQuery(keyword);

    query = buildAIQuery(query, ai);

    // fallback text search
    query = query.or(`
        title.ilike.%${ai.raw}%,
        description.ilike.%${ai.raw}%
    `);

}
    function parseAIQuery(input) {

    const text = input.toLowerCase();

    return {
        raw: input,

        isAction: text.includes("action"),
        isComedy: text.includes("comedy") || text.includes("funny"),
        isHorror: text.includes("horror") || text.includes("scary"),
        isRomance: text.includes("romance") || text.includes("love"),

        isSeries: text.includes("series") || text.includes("tv"),
        isMovie: text.includes("movie"),

        country: extractCountry(text),
        language: extractLanguage(text)
    };
}

function extractCountry(text) {

    if (text.includes("india")) return "India";
    if (text.includes("usa") || text.includes("american")) return "USA";
    if (text.includes("uk") || text.includes("british")) return "UK";

    return null;
}

function extractLanguage(text) {

    if (text.includes("english")) return "English";
    if (text.includes("french")) return "French";

    return null;
}
    function buildAIQuery(baseQuery, filters) {

    let query = baseQuery;

    // Genre boost
    if (filters.isAction) query = query.eq("category", "Action");
    if (filters.isComedy) query = query.eq("category", "Comedy");
    if (filters.isHorror) query = query.eq("category", "Horror");
    if (filters.isRomance) query = query.eq("category", "Romance");

    // Type filtering
    if (filters.isSeries) query = query.eq("type", "series");
    if (filters.isMovie) query = query.eq("type", "movie");

    // Country filter
    if (filters.country) query = query.eq("country", filters.country);

    // Language filter
    if (filters.language) query = query.eq("language", filters.language);

    return query;
}
