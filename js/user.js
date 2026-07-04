async function addFavorite(movieId) {

    const user = await requireAuth();

    if (!user) return false;

    const { error } = await supabase
        .from("favorites")
        .insert({
            user_id: user.id,
            movie_id: movieId
        });

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

async function removeFavorite(movieId) {

    const user = await requireAuth();

    if (!user) return false;

    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movieId);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

async function getFavorites() {

    const user = await requireAuth();

    if (!user) return [];

    const { data, error } = await supabase
        .from("favorites")
        .select("movie_id")
        .eq("user_id", user.id);

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}
function removeWatchlist(id) {
  console.log("Removing from watchlist:", id);
}
async function addWatchlist(movieId) {

    const user = await requireAuth();

    if (!user) return false;

    const { error } = await supabase
        .from("watchlist")
        .insert({
            user_id: user.id,
            movie_id: movieId
        });

    if (error) {

        console.error(error);

        return false;

    }

    return true;

}
function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function isInWatchlist(id) {
  return getWatchlist().includes(id);
}

function removeWatchlist(id) {
  let list = getWatchlist().filter(x => x !== id);
  localStorage.setItem("watchlist", JSON.stringify(list));
}
