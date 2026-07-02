async function getCurrentUser(){

    const { data } = await supabase.auth.getUser();

    return data.user;
}
async function addToFavorites(movieId){

    const user = await getCurrentUser();

    if(!user){
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const { error } = await supabase
        .from("favorites")
        .insert([
            {
                user_id: user.id,
                movie_id: movieId
            }
        ]);

    if(error){
        console.error(error);
        return;
    }

    alert("Added to favorites ❤️");
}
async function getFavorites(){

    const user = await getCurrentUser();

    if(!user) return [];

    const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);

    if(error){
        console.error(error);
        return [];
    }

    return data;
}
async function removeFavorite(movieId){

    const user = await getCurrentUser();

    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movieId);

    if(error){
        console.error(error);
        return;
    }

    alert("Removed from favorites");
}
async function saveWatchProgress(movieId, progress, duration){

    const user = await getCurrentUser();

    if(!user) return;

    await supabase
        .from("watch_history")
        .upsert([
            {
                user_id: user.id,
                movie_id: movieId,
                progress,
                duration,
                updated_at: new Date()
            }
        ]);
}
async function getWatchHistory(){

    const user = await getCurrentUser();

    if(!user) return [];

    const { data, error } = await supabase
        .from("watch_history")
        .select("*")
        .eq("user_id", user.id);

    if(error){
        console.error(error);
        return [];
    }

    return data;
}
