export const prerender = false;

import { supabase, jsonResponse, errorResponse } from "../../../lib/supabase-server.js";

/**
 * GET /api/books - Get all books with optional search/filter
 */
export const GET = async ({ url }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const search = url.searchParams.get("search") || "";
        const category = url.searchParams.get("category") || "all";

        let query = supabase.from("buku").select("*").order("judul");

        if (search) {
            query = query.or(
                `judul.ilike.%${search}%,kode_buku.ilike.%${search}%,penerbit.ilike.%${search}%,penulis.ilike.%${search}%`
            );
        }

        if (category && category !== "all") {
            const prefixMap = {
                Novel: "NOV",
                Pelajaran: "PLJ",
                Referensi: "REF",
                Komik: "KOM",
            };
            const prefix = prefixMap[category];
            if (prefix) {
                query = query.like("kode_buku", `${prefix}%`);
            }
        }

        const { data, error } = await query;

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ data: data || [], count: (data || []).length });
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};

/**
 * POST /api/books - Add a new book
 */
export const POST = async ({ request }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const body = await request.json();

        const newBook = {
            kode_buku: body.kode_buku || body.code,
            judul: body.judul || body.title,
            penerbit: body.penerbit || body.publisher,
            penulis: body.penulis || body.author,
            tahun_terbit: body.tahun_terbit || body.year,
            stok_total: body.stok_total || body.stock || 0,
            stok_tersedia: body.stok_tersedia || body.stock || 0,
        };

        if (!newBook.kode_buku || !newBook.judul) {
            return errorResponse("Kode buku dan judul wajib diisi", 400);
        }

        const { data, error } = await supabase
            .from("buku")
            .insert([newBook])
            .select()
            .single();

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ data }, 201);
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};
