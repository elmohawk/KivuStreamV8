/* ===========================================
   KIVUSTREAM PRO UI ENGINE
=========================================== */

/* ===========================================
   HELPERS
=========================================== */

function $(id) {
    return document.getElementById(id);
}

function truncate(text = "", length = 120) {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
}

/* ===========================================
   MOVIE CARD
=========================================== */

 function createMovieCard(movie) {

    const poster =
        movie.poster ||
        movie.image ||
        CONFIG.PLACEHOLDER;

    const year =
        (movie.year || "")
        .toString()
        .substring(0,4);

    const rating =
        movie.rating
        ? Number(movie.rating).toFixed(1)
        : "N/A";

    return `

<a class="movie-card"

href="watch.html?id=${movie.id}">

<div class="movie-poster">

<img

loading="lazy"

src="${poster}"

alt="${movie.title}"

onerror="this.src='${CONFIG.PLACEHOLDER}'"

>

<div class="movie-overlay">

<button class="play-circle">

▶

</button>

</div>

<div class="badge-year">

${year || "2025"}

</div>

<div class="badge-translator">

${movie.translator || "KivuStream"}

</div>

</div>

<div class="movie-info">

<h3>

${movie.title}

</h3>

<p>

⭐ ${rating}

</p>

</div>

</a>

`;

}

/* ===========================================
   RENDER ROW
=========================================== */
 function renderRow(containerId,movies=[]){

    const container=$(containerId);

    if(!container) return;

    if(movies.length===0){

        container.innerHTML=

        `<div class="empty">

        No content available.

        </div>`;

        return;

    }

    container.innerHTML=

        movies

        .map(createMovieCard)

        .join("");

}

/* ===========================================
   HERO
=========================================== */

let heroMovies=[];

let heroIndex=0;

let heroTimer=null;

function renderHero(items=[]){

    heroMovies=items;

    heroIndex=0;

    updateHero();

    clearInterval(heroTimer);

    heroTimer=setInterval(nextHero,

        CONFIG.HERO_INTERVAL

    );

}

function updateHero(){

    if(heroMovies.length===0) return;

    const movie=heroMovies[heroIndex];

    const banner=

        movie.banner||

        movie.poster||

        movie.image||

        CONFIG.PLACEHOLDER;

    $("heroBanner").style.backgroundImage=

`linear-gradient(

rgba(0,0,0,.70),

rgba(0,0,0,.35)

),

url(${banner})`;

    $("heroTitle").textContent=

        movie.title;

    $("heroOverview").textContent=

        truncate(

            movie.description||

            movie.overview||

            "",

            180

        );

    $("watchNowBtn").href=

        `watch.html?id=${movie.id}`;

}

 function nextHero(){

    heroIndex++;

    if(heroIndex>=heroMovies.length){

        heroIndex=0;

    }

    updateHero();

}

 function previousHero(){

    heroIndex--;

    if(heroIndex<0){

        heroIndex=

        heroMovies.length-1;

    }

    updateHero();

}

/* ===========================================
   VIEW ALL BUTTON
=========================================== */

 function renderSection(

containerId,

movies,

type

){

    const container=$(containerId);

    if(!container) return;

    const limit=

        CONFIG.MOVIES_PER_ROW;

    const visible=

        movies.slice(0,limit);

    container.innerHTML=

        visible

        .map(createMovieCard)

        .join("");

    if(movies.length>limit){

        const button=

            document.createElement("button");

        button.className=

            "view-all-btn";

        button.textContent=

            "View All →";

        button.onclick=()=>{

            localStorage.setItem(

                "viewAll",

                JSON.stringify(movies)

            );

            location.href=

                `viewall.html?type=${type}`;

        };

        container.appendChild(button);

    }

}

/* ===========================================
   LOADER
=========================================== */

 function showLoader(){

    const loader=$("loader");

    if(loader){

        loader.style.display="flex";

    }

}

 function hideLoader(){

    const loader=$("loader");

    if(loader){

        loader.style.display="none";

    }

}

/* ===========================================
   TOAST
=========================================== */
 function toast(message){

    const toast=

    document.createElement("div");

    toast.className="toast";

    toast.innerHTML=message;

    document.body.appendChild(toast);

    requestAnimationFrame(()=>{

        toast.classList.add("show");

    });

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },3000);

}

/* ===========================================
   SKELETON
=========================================== */

 function renderSkeleton(

containerId,

count=12

){

    const container=$(containerId);

    if(!container) return;

    let html="";

    for(let i=0;i<count;i++){

        html+=`

<div class="movie-card skeleton">

<div class="movie-poster"></div>

<div class="movie-info">

<div class="line"></div>

<div class="line short"></div>

</div>

</div>

`;

    }

    container.innerHTML=html;

}

/* ===========================================
   IMAGE LAZY LOAD
=========================================== */

const observer=

new IntersectionObserver(

entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const img=

entry.target;

img.src=

img.dataset.src;

observer.unobserve(img);

}

});

}

);

 function enableLazyImages(){

document

.querySelectorAll(

"img[data-src]"

)

.forEach(img=>{

observer.observe(img);

});

}
window.renderHero = renderHero;
window.renderSection = renderSection;
window.renderSkeleton = renderSkeleton;
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.toast = toast;
