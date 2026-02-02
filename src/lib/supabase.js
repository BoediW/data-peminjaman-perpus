import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseUrl !== "YOUR_SUPABASE_URL" && supabaseUrl.startsWith("http");

if (!isConfigured) {
    console.warn("Supabase credentials missing or invalid in .env file. Using mock client.");
}

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: { message: "Supabase not configured. Check .env file." } }),
            insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
            update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
            delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        }),
    };
