
async function getCurrentUser() {
    const { data } = await supabaseClient.auth.getUser();
    return data?.user;
}
async function register(name, email, password) {

    const { data, error } = await supabaseClient.auth.signUp({
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

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    return { data, error };
}

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = "index.html";
}


async function requireAuth() {
  const { data } = await supabaseClient.auth.getUser();
  return data?.user || null;
}
