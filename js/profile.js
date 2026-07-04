document.addEventListener("DOMContentLoaded", init);

async function init() {

    const user = await requireAuth();

    if (!user) return;

    loadProfile(user);

    document
        .getElementById("logout")
        .addEventListener("click", logout);

}

async function loadProfile(user) {

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {

        console.error(error);

        return;

    }

    document.getElementById("fullName").textContent =
        data.full_name || "User";

    document.getElementById("email").textContent =
        user.email;

    if (data.avatar_url) {

        document.getElementById("avatar").src =
            data.avatar_url;

    }

}
