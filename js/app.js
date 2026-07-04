// Load HTML components (navbar, footer)
async function loadComponent(id, file) {
    const element = document.getElementById(id);

    // Skip if the placeholder doesn't exist on this page
    if (!element) return;

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        const html = await response.text();
        element.innerHTML = html;

    } catch (error) {
        console.error(error);
    }
}

// Update navbar based on login status
async function updateNavbar() {

    const authMenu = document.getElementById("authMenu");

    if (!authMenu) return;

    const user = await getCurrentUser();

    if (user) {

        authMenu.innerHTML = `
            <a href="profile.html" class="login-btn">
                My Profile
            </a>

            <button id="logoutBtn" class="login-btn">
                Logout
            </button>
        `;

        document
            .getElementById("logoutBtn")
            .addEventListener("click", logout);

    } else {

        authMenu.innerHTML = `
            <a href="login.html" class="login-btn">
                Login
            </a>

            <a href="register.html" class="btn btn-secondary">
                Register
            </a>
        `;
    }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("navbar", "components/navbar.html");
    await loadComponent("footer", "components/footer.html");

    // Update navbar after it has been loaded
    if (typeof getCurrentUser === "function") {
        await updateNavbar();
    }

    // Listen for authentication changes
    if (typeof supabase !== "undefined") {
        supabase.auth.onAuthStateChange(() => {
            updateNavbar();
        });
    }

});
