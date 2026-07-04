async function register(name, email, password) {

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name
            }
        }
    });

    if (error) {
        return { data, error };
    }

    if (data.user) {

        await supabase
            .from("profiles")
            .insert({
                id: data.user.id,
                full_name: name
            });

    }

    return { data, error };

}
async function login(email, password) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return { data, error };
}

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "index.html";
}

async function getCurrentUser() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    return user;
}

async function requireAuth() {

    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return user;
}
