export const prerender = false;

import { supabase, jsonResponse, errorResponse } from "../../../../lib/supabase-server.js";

/**
 * PUT /api/loans/[id]/return - Return a borrowed book
 */
export const PUT = async ({ params }) => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const { id } = params;

        // Get the loan
        const { data: loan, error: loanError } = await supabase
            .from("peminjaman")
            .select("*")
            .eq("id", id)
            .single();

        if (loanError || !loan) {
            return errorResponse("Peminjaman tidak ditemukan", 404);
        }

        if (loan.status === "kembali") {
            return errorResponse("Buku sudah dikembalikan sebelumnya", 400);
        }

        // Update loan status
        const { data: updatedLoan, error: updateError } = await supabase
            .from("peminjaman")
            .update({
                status: "kembali",
                tanggal_kembali_aktual: new Date().toISOString().split("T")[0],
            })
            .eq("id", id)
            .select()
            .single();

        if (updateError) return errorResponse(updateError.message, 400);

        // Update book stock
        const { data: book } = await supabase
            .from("buku")
            .select("stok_tersedia")
            .eq("kode_buku", loan.kode_buku)
            .single();

        if (book) {
            await supabase
                .from("buku")
                .update({ stok_tersedia: (book.stok_tersedia || 0) + 1 })
                .eq("kode_buku", loan.kode_buku);
        }

        return jsonResponse({ data: updatedLoan, message: "Buku berhasil dikembalikan" });
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};
