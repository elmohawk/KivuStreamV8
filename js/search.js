const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// LIVE SEARCH
let timeout = null;

searchInput.addEventListener("input", (e) => {

    clearTimeout(timeout);

    const query = e.target.value.trim();

    if(query.length < 2){
        searchResults.style.display = "none";
        return;
    }

    timeout = setTimeout(() => {
        performSearch(query);
    }, 400);

});

async function performSearch(query){

    const results = await searchMovies(query);

    renderSearchResults(results);
}

function renderSearchResults(movies){

    searchResults.innerHTML = "";

    if(!movies || movies.length === 0){
        searchResults.style.display = "none";
        return;
    }

    movies.slice(0,8).forEach(movie => {

        const item = document.createElement("div");

        item.classList.add("search-item");

        item.innerHTML = `
            <img src="${getImage(movie.poster_path)}">
            <div class="search-info">
                <h4>${movie.title}</h4>
                <span>${movie.release_date?.split("-")[0] || ""}</span>
            </div>
        `;

        item.addEventListener("click", () => {

            // later we will redirect to watch page
            window.location.href = `watch.html?id=${movie.id}`;

        });

        searchResults.appendChild(item);

    });

    searchResults.style.display = "block";
}

// CLOSE WHEN CLICK OUTSIDE
document.addEventListener("click", (e) => {

    if(!e.target.closest(".search-box")){
        searchResults.style.display = "none";
    }

});
