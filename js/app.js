async function loadComponent(id, file) {
    const response = await fetch(file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("navbar", "components/navbar.html");
    await loadComponent("footer", "components/footer.html");

});
async function updateNavbar() {

    const authMenu = document.getElementById("authMenu");

    if (!authMenu) return;

    const user = await getCurrentUser();

    if (user) {

        authMenu.innerHTML = `
            <a href="profile.html" class="login-btn">
                My Profile
            </a>

            <button
                id="logoutBtn"
                class="login-btn">
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

            <a href="register.html"
                class="btn btn-secondary">
                Register
            </a>
        `;

    }

}
