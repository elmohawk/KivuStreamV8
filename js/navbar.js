
// ======================================
// KivuStream Navbar
// Dynamic Menus from Supabase
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadBrowseMenu();
    loadCountryMenu();
    loadTranslatorMenu();

});

// ======================================
// Browse (Categories)
// ======================================

async function loadBrowseMenu() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("category")
        .eq("is_active", true);

    if (error) {

        console.error(error);
        return;

    }

    const categories = [...new Set(

        data
            .map(item => item.category)
            .filter(Boolean)

    )].sort();

    const menu = document.getElementById("browseMenu");

    if (!menu) return;

    menu.innerHTML = categories.map(category => `

        <li>

            <a href="movies.html?category=${encodeURIComponent(category)}">

                🎬 ${category}

            </a>

        </li>

    `).join("");

}

// ======================================
// Countries
// ======================================

async function loadCountryMenu() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("country")
        .eq("is_active", true);

    if (error) {

        console.error(error);
        return;

    }

    const countries = [...new Set(

        data
            .map(item => item.country)
            .filter(Boolean)

    )].sort();

    const menu = document.getElementById("countryMenu");

    if (!menu) return;

    menu.innerHTML = countries.map(country => `

        <li>

            <a href="movies.html?country=${encodeURIComponent(country)}">

                🌍 ${country}

            </a>

        </li>

    `).join("");

}

// ======================================
// Translators
// ======================================

async function loadTranslatorMenu() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("translator")
        .eq("is_active", true);

    if (error) {

        console.error(error);
        return;

    }

    const translators = [...new Set(

        data
            .map(item => item.translator)
            .filter(Boolean)

    )].sort();

    const menu = document.getElementById("translatorMenu");

    if (!menu) return;

    menu.innerHTML = translators.map(translator => `

        <li>

            <a href="movies.html?translator=${encodeURIComponent(translator)}">

                🎙 ${translator}

            </a>

        </li>

    `).join("");

}
