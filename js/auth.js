import { supabase } from "./supabase.js";

export async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user;
}

export async function register(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name
            }
        }
    });

    if (error) return { data, error };

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

export async function login(email, password) {
    return await supabase.auth.signInWithPassword({
        email,
        password
    });
}

export async function logout() {
    await supabase.auth.signOut();
    window.location.href = "index.html";
}

export async function requireAuth() {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
}
