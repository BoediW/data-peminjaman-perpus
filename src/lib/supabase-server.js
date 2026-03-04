/**
 * Server-side Supabase client for API routes.
 * Uses private env vars (not exposed to browser).
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseUrl !== "YOUR_SUPABASE_URL" && supabaseUrl.startsWith("http");

if (!isConfigured) {
    console.warn("[Server] Supabase credentials missing. API routes will return mock data.");
}

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Helper: returns JSON Response
 */
export function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

/**
 * Helper: returns error JSON Response
 */
export function errorResponse(message, status = 500) {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}
