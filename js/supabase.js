const supabaseClient = supabase.createClient(
    window.SUPABASE.URL,
    window.SUPABASE.KEY
);

// Make global
window.supabase = supabaseClient;
