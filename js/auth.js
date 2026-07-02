// ===========================================
// KIVUSTREAM AUTH SYSTEM
// ===========================================

// SIGN UP
async function signUp(email, password){

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if(error){
        alert(error.message);
        return;
    }

    alert("Account created successfully!");
    window.location.href = "login.html";

}


// LOGIN
async function signIn(email, password){

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if(error){
        alert(error.message);
        return;
    }

    alert("Login successful!");
    window.location.href = "index.html";

}


// LOGOUT
async function logout(){

    await supabase.auth.signOut();

    window.location.href = "login.html";

}


// GET CURRENT USER
function getUser(){

    return supabase.auth.getUser();

}


// CHECK SESSION ON LOAD
async function checkAuth(){

    const { data } = await supabase.auth.getSession();

    return data.session;

}
