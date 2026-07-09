/* ===========================================
   KIVUSTREAM PRO HOME
=========================================== */
const HOME_SECTIONS = window.HOME_SECTIONS;
/* ===========================================
   GLOBAL
=========================================== */

window.allMovies = [];

window.heroMovies = [];

/* ===========================================
   LOAD HOME
=========================================== */

document.addEventListener(

    "DOMContentLoaded",

    loadHome

);

/* ===========================================
   HOME LOADER
=========================================== */

async function loadHome(){

    try{

        showLoader();

        renderLoading();

        /* Load database */

        const [

            movies,

            series

        ]=await Promise.all([

            getMovies(),

            getSeries()

        ]);

        /* Merge */

        const merged=[

            ...(movies||[]),

            ...(series||[]).map(item=>({

                ...item,

                type:"series"

            }))

        ];

        /* TMDB */

        const enriched=

            await enrichAll(merged);

        window.allMovies=enriched;

        /* Hero */

        loadHero(enriched);

        /* Homepage */

        loadSections(enriched);

        hideLoader();

    }

    catch(err){

        console.error(err);

        hideLoader();

        toast("Failed loading homepage");

    }

}

/* ===========================================
   HERO
=========================================== */

function loadHero(items){

    const hero=

        items

        .filter(

            movie=>

            movie.banner

        )

        .sort(

            (a,b)=>

            (b.rating||0)-

            (a.rating||0)

        )

        .slice(0,8);

    window.heroMovies=hero;

    renderHero(hero);

}
   
/* ===========================================
   HOMEPAGE SECTIONS
=========================================== */

function loadSections(items){

    HOME_SECTIONS.forEach(section=>{

        let results=[];

        switch(section.type){

            case "featured":

                results=

                items

                .filter(

                    m=>m.featured

                );

                break;

            case "movie":

                results=

                items

                .filter(

                    m=>

                    m.type!=="series"

                );

                break;

            case "series":

                results=

                items

                .filter(

                    m=>

                    m.type==="series"

                );

                break;

            default:

                results=

                items

                .filter(

                    movie=>

                    movie.category===

                    section.category

                );

        }

        renderSection(

            section.id,

            results,

            section.title

        );

    });

}

/* ===========================================
   SKELETON
=========================================== */

function renderLoading(){

    HOME_SECTIONS.forEach(section=>{

        renderSkeleton(

            section.id,

            12

        );

    });

}

/* ===========================================
   SEARCH SUPPORT
=========================================== */

window.searchHome=function(keyword){

    keyword=

        keyword

        .toLowerCase()

        .trim();

    if(!keyword){

        loadSections(

            window.allMovies

        );

        return;

    }

    const filtered=

        window.allMovies.filter(movie=>{

            return(

                movie.title

                ?.toLowerCase()

                .includes(keyword)

                ||

                movie.category

                ?.toLowerCase()

                .includes(keyword)

                ||

                movie.description

                ?.toLowerCase()

                .includes(keyword)

            );

        });

    loadSections(filtered);

};

/* ===========================================
   VIEW ALL
=========================================== */

window.openCategory=function(category){

    const data=

        window.allMovies.filter(

            movie=>

            movie.category===category

        );

    localStorage.setItem(

        "viewAll",

        JSON.stringify(data)

    );

    location.href=

    "viewall.html";

};

/* ===========================================
   REFRESH
=========================================== */

window.refreshHome=

loadHome;
