export const prerender = false;

import { supabase, jsonResponse, errorResponse } from "../../../lib/supabase-server.js";

/**
 * GET /api/dashboard/stats - Get dashboard statistics
 */
export const GET = async () => {
    try {
        if (!supabase) return errorResponse("Database not configured", 503);

        const [bukuRes, siswaRes, peminjamanRes] = await Promise.all([
            supabase.from("buku").select("*"),
            supabase.from("siswa").select("*"),
            supabase.from("peminjaman").select("*"),
        ]);

        if (bukuRes.error) return errorResponse(bukuRes.error.message, 400);
        if (siswaRes.error) return errorResponse(siswaRes.error.message, 400);
        if (peminjamanRes.error) return errorResponse(peminjamanRes.error.message, 400);

        const books = bukuRes.data || [];
        const borrowers = siswaRes.data || [];
        const loans = peminjamanRes.data || [];

        const totalBooks = books.reduce((acc, b) => acc + (b.stok_total || 0), 0);
        const availableBooks = books.reduce((acc, b) => acc + (b.stok_tersedia || 0), 0);
        const borrowedBooks = totalBooks - availableBooks;
        const totalBorrowers = borrowers.length;
        const activeLoansCount = loans.filter(
            (l) => l.status === "dipinjam" || l.status === "terlambat"
        ).length;
        const overdueCount = loans.filter((l) => l.status === "terlambat").length;

        return jsonResponse({
            data: {
                totalBooks,
                availableBooks,
                borrowedBooks,
                totalBorrowers,
                activeLoansCount,
                overdueCount,
                totalBookTitles: books.length,
            },
        });
    } catch (err) {
        return errorResponse("Internal server error: " + err.message);
    }
};
