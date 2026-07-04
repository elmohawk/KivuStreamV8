document.addEventListener("DOMContentLoaded", async () => {
    await requireAuth();

    // Load the user's profile here
    loadProfile();
});
