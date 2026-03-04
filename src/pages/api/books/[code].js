export const prerender = false;

import { supabase, jsonResponse, errorResponse } from "../../../lib/supabase-server.js";

/**
 * GET /api/books/[code] - Get a single book by kode_buku
 */
export const GET = async ({ params }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const { code } = params;

        const { data, error } = await supabase
            .from("buku")
            .select("*")
            .eq("kode_buku", code)
            .single();

        if (error) return errorResponse("Buku tidak ditemukan", 404);

        return jsonResponse({ data });
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};

/**
 * PUT /api/books/[code] - Update a book
 */
export const PUT = async ({ params, request }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const { code } = params;
        const body = await request.json();

        // Remove kode_buku from update payload (it's the primary key)
        const { kode_buku, ...updateData } = body;

        const { data, error } = await supabase
            .from("buku")
            .update(updateData)
            .eq("kode_buku", code)
            .select()
            .single();

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ data });
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};

/**
 * DELETE /api/books/[code] - Delete a book
 */
export const DELETE = async ({ params }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const { code } = params;

        const { error } = await supabase
            .from("buku")
            .delete()
            .eq("kode_buku", code);

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ message: "Buku berhasil dihapus" });
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};
