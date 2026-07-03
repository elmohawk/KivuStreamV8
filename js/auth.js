// ===========================================
// KIVUSTREAM AUTH SYSTEM
// ===========================================

// SIGN UP
async function register(email, password, username){

    const { data, error } = await supabase.auth.signUp({

        email,
        password,

        options:{
            data:{
                username
            }
        }

    });

    if(error){

        alert(error.message);

        return;

    }

    alert("Account created successfully.");

}
// LOGIN
async function login(email,password){

    const { error } = await supabase.auth.signInWithPassword({

        email,
        password

    });

    if(error){

        alert(error.message);

        return;

    }

    window.location="index.html";

}
// LOGOUT
async function logout(){

    await supabase.auth.signOut();

    window.location="login.html";

}

// GET CURRENT USER
async function getCurrentUser(){

    const {

        data:{user}

    } = await supabase.auth.getUser();

    return user;

}
// CHECK SESSION ON LOAD
async function requireLogin(){

    const user = await getCurrentUser();

    if(!user){

        window.location="login.html";

    }

}
async function requireAdmin(){

    const user = await getCurrentUser();

    if(!user){

        location = "login.html";

        return;

    }

    const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if(data.role !== "admin"){

        location = "index.html";

    }

}
async function updateNavbar(){

    const user = await getCurrentUser();

    const loginBtn = document.querySelector(".login-btn");

    if(!loginBtn) return;

    if(user){

        loginBtn.innerHTML = "My Account";

        loginBtn.href = "profile.html";

    }else{

        loginBtn.innerHTML = "Login";

        loginBtn.href = "login.html";

    }

}

document.addEventListener("DOMContentLoaded", updateNavbar);
