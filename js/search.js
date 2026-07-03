let searchTimeout;
async function handleSearch(query){

    const resultsBox = document.getElementById("searchResults");

    if(!query){

        resultsBox.innerHTML = "";
        resultsBox.style.display = "none";
        return;

    }

    const results = await KivuAPI.searchMovies(query);

    if(!results || results.length === 0){

        resultsBox.innerHTML = `
            <div class="search-item">
                No results found
            </div>
        `;

        resultsBox.style.display = "block";

        return;

    }

    resultsBox.innerHTML = results.slice(0,8).map(movie => `

        <div class="search-item" data-id="${movie.id}">

            <img src="${KivuAPI.getImage(movie.poster_path)}">

            <div>

                <h4>${movie.title}</h4>

                <span>${movie.release_date?.slice(0,4) || "--"}</span>

            </div>

        </div>

    `).join("");

    resultsBox.style.display = "block";

}
const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", (e) => {

        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {

            handleSearch(e.target.value.trim());

        }, 400);

    });

}
document.addEventListener("click", (e)=>{

    const box = document.getElementById("searchResults");

    const input = document.getElementById("searchInput");

    if(!box.contains(e.target) && e.target !== input){

        box.style.display = "none";

    }

});
document.addEventListener("click", (e)=>{

    const item = e.target.closest(".search-item");

    if(!item) return;

    const movieId = item.dataset.id;

    window.location.href = `watch.html?id=${movieId}`;

});
