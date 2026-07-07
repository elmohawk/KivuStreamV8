 async function getMovies(){

    const {data,error}=await supabase

        .from("movies")

        .select("*")

        .order("created_at",{ascending:false});

    if(error){

        console.error(error);

        return [];

    }

    return data;

}

 async function getSeries(){

    const {data,error}=await supabase

        .from("series")

        .select("*")

        .order("created_at",{ascending:false});

    if(error){

        console.error(error);

        return [];

    }

    return data;

}

async function getEpisodes(seriesId){

    const {data,error}=await supabase

        .from("episodes")

        .select("*")

        .eq("series_id",seriesId)

        .order("season")

        .order("episode");

    if(error){

        console.error(error);

        return [];

    }

    return data;

}
