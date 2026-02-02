import { signal, computed } from "@preact/signals";
import { supabase } from "../lib/supabase";

// SIGNALS - State Management
export const books = signal([]);       // Data dari tabel 'buku'
export const borrowers = signal([]);   // Data dari tabel 'siswa'
export const loans = signal([]);       // Data dari tabel 'peminjaman'
export const isLoading = signal(false);
export const searchQuery = signal("");
export const selectedCategory = signal("all");
export const activeTab = signal("dashboard");

// INITIAL DATA FETCH
export async function loadData() {
  isLoading.value = true;
  try {
    const [bukuRes, siswaRes, peminjamanRes] = await Promise.all([
      supabase.from("buku").select("*").order("judul"),
      supabase.from("siswa").select("*").order("nama_siswa"),
      supabase.from("peminjaman").select("*").order("tanggal_pinjam", { ascending: false }),
    ]);

    if (bukuRes.error) throw bukuRes.error;
    if (siswaRes.error) throw siswaRes.error;
    if (peminjamanRes.error) throw peminjamanRes.error;

    books.value = bukuRes.data || [];
    borrowers.value = siswaRes.data || [];
    loans.value = peminjamanRes.data || [];
  } catch (error) {
    console.error("Error loading data:", error.message);
  } finally {
    isLoading.value = false;
  }
}

// Load data immediately
loadData();

// COMPUTED VALUES
export const categories = computed(() => {
  if (!books.value.length) return ["all"];
  // Derive categories from book codes (e.g., NOV-001 -> Novel)
  const cats = [...new Set(books.value.map((book) => {
    const code = book.kode_buku || "";
    if (code.startsWith("NOV")) return "Novel";
    if (code.startsWith("PLJ")) return "Pelajaran";
    if (code.startsWith("REF")) return "Referensi";
    if (code.startsWith("KOM")) return "Komik";
    return "Lainnya";
  }))];
  return ["all", ...cats];
});

export const filteredBooks = computed(() => {
  let result = books.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (book) =>
        book.judul?.toLowerCase().includes(query) ||
        book.kode_buku?.toLowerCase().includes(query) ||
        book.penerbit?.toLowerCase().includes(query) ||
        book.penulis?.toLowerCase().includes(query),
    );
  }

  // Filter by category
  if (selectedCategory.value !== "all") {
    result = result.filter((book) => {
      const code = book.kode_buku || "";
      if (selectedCategory.value === "Novel") return code.startsWith("NOV");
      if (selectedCategory.value === "Pelajaran") return code.startsWith("PLJ");
      if (selectedCategory.value === "Referensi") return code.startsWith("REF");
      if (selectedCategory.value === "Komik") return code.startsWith("KOM");
      return true;
    });
  }

  return result;
});

export const activeLoans = computed(() => {
  return loans.value.filter((loan) => loan.status === "dipinjam" || loan.status === "terlambat");
});

export const dashboardStats = computed(() => {
  const totalBooks = books.value.reduce((acc, book) => acc + (book.stok_total || 0), 0);
  const availableBooks = books.value.reduce((acc, book) => acc + (book.stok_tersedia || 0), 0);
  const borrowedBooks = totalBooks - availableBooks;
  const totalBorrowers = borrowers.value.length;
  const activeLoansCount = activeLoans.value.length;
  const overdueCount = loans.value.filter((loan) => loan.status === "terlambat").length;

  return {
    totalBooks,
    borrowedBooks,
    availableBooks,
    totalBorrowers,
    activeLoansCount,
    overdueCount,
  };
});

// ACTIONS - Book Management (Tabel: buku)
export async function addBook(bookData) {
  const newBook = {
    kode_buku: bookData.code || bookData.kode_buku,
    judul: bookData.title || bookData.judul,
    penerbit: bookData.publisher || bookData.penerbit,
    penulis: bookData.author || bookData.penulis,
    tahun_terbit: bookData.year || bookData.tahun_terbit,
    stok_total: bookData.stock || bookData.stok_total || 0,
    stok_tersedia: bookData.stock || bookData.stok_tersedia || 0,
  };

  const { data, error } = await supabase
    .from("buku")
    .insert([newBook])
    .select()
    .single();

  if (error) {
    console.error("Error adding book:", error.message);
    throw error;
  }

  books.value = [...books.value, data];
  return data;
}

export async function updateBook(kode_buku, bookData) {
  const { data, error } = await supabase
    .from("buku")
    .update(bookData)
    .eq("kode_buku", kode_buku)
    .select()
    .single();

  if (error) {
    console.error("Error updating book:", error.message);
    throw error;
  }

  books.value = books.value.map((book) => (book.kode_buku === kode_buku ? data : book));
  return data;
}

export async function deleteBook(kode_buku) {
  const { error } = await supabase.from("buku").delete().eq("kode_buku", kode_buku);

  if (error) {
    console.error("Error deleting book:", error.message);
    throw error;
  }

  books.value = books.value.filter((book) => book.kode_buku !== kode_buku);
}

// ACTIONS - Borrower Management (Tabel: siswa)
export async function addBorrower(borrowerData) {
  const newSiswa = {
    nisn: borrowerData.nisn,
    nama_siswa: borrowerData.name || borrowerData.nama_siswa,
    kelas: borrowerData.class || borrowerData.kelas,
  };

  const { data, error } = await supabase
    .from("siswa")
    .insert([newSiswa])
    .select()
    .single();

  if (error) {
    console.error("Error adding borrower:", error.message);
    throw error;
  }

  borrowers.value = [...borrowers.value, data];
  return data;
}

export function searchBorrower(query) {
  const q = query.toLowerCase();
  return borrowers.value.filter(
    (siswa) =>
      siswa.nama_siswa?.toLowerCase().includes(q) ||
      siswa.nisn?.includes(q) ||
      siswa.kelas?.toLowerCase().includes(q),
  );
}

// ACTIONS - Loan Management (Tabel: peminjaman)
export async function borrowBook(nisn, kode_buku) {
  const book = books.value.find((b) => b.kode_buku === kode_buku);

  if (!book || (book.stok_tersedia || 0) <= 0) {
    return { success: false, message: "Buku tidak tersedia" };
  }

  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period

  const newLoan = {
    nisn: nisn,
    kode_buku: kode_buku,
    tanggal_pinjam: today.toISOString().split("T")[0],
    tenggat_kembali: dueDate.toISOString().split("T")[0],
    status: "dipinjam",
  };

  const { data, error } = await supabase
    .from("peminjaman")
    .insert([newLoan])
    .select()
    .single();

  if (error) {
    console.error("Error creating loan:", error.message);
    return { success: false, message: error.message };
  }

  loans.value = [...loans.value, data];

  // Update stok_tersedia locally
  books.value = books.value.map((b) =>
    b.kode_buku === kode_buku ? { ...b, stok_tersedia: Math.max(0, (b.stok_tersedia || 0) - 1) } : b
  );

  // Also update in database
  await supabase
    .from("buku")
    .update({ stok_tersedia: book.stok_tersedia - 1 })
    .eq("kode_buku", kode_buku);

  return { success: true, loan: data };
}

export async function returnBook(loanId) {
  const loan = loans.value.find((l) => l.id === loanId);
  if (!loan) {
    return { success: false, message: "Peminjaman tidak ditemukan" };
  }

  const { data, error } = await supabase
    .from("peminjaman")
    .update({
      status: "kembali",
      tanggal_kembali_aktual: new Date().toISOString().split("T")[0]
    })
    .eq("id", loanId)
    .select()
    .single();

  if (error) {
    console.error("Error returning book:", error.message);
    return { success: false, message: error.message };
  }

  // Update loan status locally
  loans.value = loans.value.map((l) => (l.id === loanId ? data : l));

  // Update stok_tersedia
  const book = books.value.find((b) => b.kode_buku === loan.kode_buku);
  if (book) {
    books.value = books.value.map((b) =>
      b.kode_buku === loan.kode_buku ? { ...b, stok_tersedia: (b.stok_tersedia || 0) + 1 } : b
    );

    await supabase
      .from("buku")
      .update({ stok_tersedia: (book.stok_tersedia || 0) + 1 })
      .eq("kode_buku", loan.kode_buku);
  }

  return { success: true };
}

export function getLoanDetails(loanId) {
  const loan = loans.value.find((l) => l.id === loanId);
  if (!loan) return null;

  const borrower = borrowers.value.find((s) => s.nisn === loan.nisn);
  const book = books.value.find((b) => b.kode_buku === loan.kode_buku);

  return {
    ...loan,
    // Map to camelCase for components
    borrowDate: loan.tanggal_pinjam,
    dueDate: loan.tenggat_kembali,
    returnDate: loan.tanggal_kembali_aktual,
    borrowerId: loan.nisn,
    bookId: loan.kode_buku,
    borrower: borrower ? {
      id: borrower.nisn,
      nisn: borrower.nisn,
      name: borrower.nama_siswa,
      class: borrower.kelas,
    } : null,
    book: book ? {
      id: book.kode_buku,
      code: book.kode_buku,
      title: book.judul,
      publisher: book.penerbit,
      author: book.penulis,
      year: book.tahun_terbit,
      stock: book.stok_total,
      available: book.stok_tersedia,
    } : null,
    // Normalize status for components
    status: loan.status === "dipinjam" ? "active" :
      loan.status === "terlambat" ? "overdue" : "returned",
  };
}

export function getActiveLoansByBorrower(nisn) {
  return loans.value
    .filter((loan) => loan.nisn === nisn && loan.status !== "kembali")
    .map((loan) => getLoanDetails(loan.id));
}

// UTILITY FUNCTIONS
export function formatDate(dateString) {
  if (!dateString) return "-";
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

export function isOverdue(dueDate) {
  return new Date(dueDate) < new Date();
}

// Helper to get book by code (for components)
export function getBookByCode(kode_buku) {
  return books.value.find((b) => b.kode_buku === kode_buku);
}

// Helper to get borrower by NISN
export function getBorrowerByNisn(nisn) {
  return borrowers.value.find((s) => s.nisn === nisn);
}
