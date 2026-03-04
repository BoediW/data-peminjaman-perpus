export const prerender = false;

import { supabase, jsonResponse, errorResponse } from "../../../lib/supabase-server.js";

/**
 * GET /api/borrowers - Get all borrowers (siswa)
 */
export const GET = async ({ url }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const search = url.searchParams.get("search") || "";

        let query = supabase.from("siswa").select("*").order("nama_siswa");

        if (search) {
            query = query.or(
                `nama_siswa.ilike.%${search}%,nisn.ilike.%${search}%,kelas.ilike.%${search}%`
            );
        }

        const { data, error } = await query;

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ data: data || [], count: (data || []).length });
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};

/**
 * POST /api/borrowers - Add a new borrower (siswa)
 */
export const POST = async ({ request }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const body = await request.json();

        const newSiswa = {
            nisn: body.nisn,
            nama_siswa: body.nama_siswa || body.name,
            kelas: body.kelas || body.class,
        };

        if (!newSiswa.nisn || !newSiswa.nama_siswa) {
            return errorResponse("NISN dan nama siswa wajib diisi", 400);
        }

        const { data, error } = await supabase
            .from("siswa")
            .insert([newSiswa])
            .select()
            .single();

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ data }, 201);
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};
