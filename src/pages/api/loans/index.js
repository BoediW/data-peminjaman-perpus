export const prerender = false;

import { supabase, jsonResponse, errorResponse } from "../../../lib/supabase-server.js";

/**
 * GET /api/loans - Get all loans (peminjaman)
 */
export const GET = async ({ url }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const status = url.searchParams.get("status") || "";

        let query = supabase
            .from("peminjaman")
            .select("*")
            .order("tanggal_pinjam", { ascending: false });

        if (status && status !== "all") {
            query = query.eq("status", status);
        }

        const { data, error } = await query;

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ data: data || [], count: (data || []).length });
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};

/**
 * POST /api/loans - Create a new loan (borrow a book)
 */
export const POST = async ({ request }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const body = await request.json();
        const { nisn, kode_buku } = body;

        if (!nisn || !kode_buku) {
            return errorResponse("NISN dan kode buku wajib diisi", 400);
        }

        // Check book availability
        const { data: book, error: bookError } = await supabase
            .from("buku")
            .select("*")
            .eq("kode_buku", kode_buku)
            .single();

        if (bookError || !book) {
            return errorResponse("Buku tidak ditemukan", 404);
        }

        if ((book.stok_tersedia || 0) <= 0) {
            return errorResponse("Stok buku habis", 400);
        }

        // Check borrower exists
        const { data: borrower, error: borrowerError } = await supabase
            .from("siswa")
            .select("*")
            .eq("nisn", nisn)
            .single();

        if (borrowerError || !borrower) {
            return errorResponse("Siswa tidak ditemukan", 404);
        }

        // Create loan
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

        const newLoan = {
            nisn,
            kode_buku,
            tanggal_pinjam: today.toISOString().split("T")[0],
            tenggat_kembali: dueDate.toISOString().split("T")[0],
            status: "dipinjam",
        };

        const { data: loan, error: loanError } = await supabase
            .from("peminjaman")
            .insert([newLoan])
            .select()
            .single();

        if (loanError) return errorResponse(loanError.message, 400);

        // Update stock
        await supabase
            .from("buku")
            .update({ stok_tersedia: Math.max(0, (book.stok_tersedia || 0) - 1) })
            .eq("kode_buku", kode_buku);

        return jsonResponse({ data: loan, message: "Peminjaman berhasil dicatat" }, 201);
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};
