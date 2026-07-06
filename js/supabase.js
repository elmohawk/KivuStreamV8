import { createClient } from
"https://esm.sh/@supabase/supabase-js";

import { SUPABASE } from "./config.js";

export const supabase = createClient(

    SUPABASE.URL,

    SUPABASE.KEY

);
