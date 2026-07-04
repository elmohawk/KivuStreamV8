async function register(name,email,password){

    const {data,error}=await supabase.auth.signUp({

        email,

        password,

        options:{
            data:{
                full_name:name
            }
        }

    });

    return {data,error};

}
async function login(email,password){

    const {data,error}=await supabase.auth.signInWithPassword({

        email,

        password

    });

    return {data,error};

}
async function logout() {

    await supabase.auth.signOut();

    window.location.href = "index.html";

}
async function getCurrentUser(){

    const {data}=await supabase.auth.getUser();

    return data.user;

}
async function requireAuth(){

    const user=await getCurrentUser();

    if(!user){

        location.href="login.html";

    }

}
