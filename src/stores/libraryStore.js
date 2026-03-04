import { signal, computed } from "@preact/signals";

// ==========================================
// API Helper
// ==========================================
async function api(path, options = {}) {
  const { method = "GET", body } = options;
  const config = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`/api${path}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }
  return data;
}

// ==========================================
// SIGNALS - State Management
// ==========================================
export const books = signal([]);
export const borrowers = signal([]);
export const loans = signal([]);
export const isLoading = signal(false);
export const searchQuery = signal("");
export const selectedCategory = signal("all");
export const activeTab = signal("dashboard");

// ==========================================
// INITIAL DATA FETCH (via REST API)
// ==========================================
export async function loadData() {
  isLoading.value = true;
  try {
    const [booksRes, borrowersRes, loansRes] = await Promise.all([
      api("/books"),
      api("/borrowers"),
      api("/loans"),
    ]);

    books.value = booksRes.data || [];
    borrowers.value = borrowersRes.data || [];
    loans.value = loansRes.data || [];
  } catch (error) {
    console.error("Error loading data:", error.message);
  } finally {
    isLoading.value = false;
  }
}

// Load data immediately
loadData();

// ==========================================
// COMPUTED VALUES
// ==========================================
export const categories = computed(() => {
  if (!books.value.length) return ["all"];
  const cats = [
    ...new Set(
      books.value.map((book) => {
        const code = book.kode_buku || "";
        if (code.startsWith("NOV")) return "Novel";
        if (code.startsWith("PLJ")) return "Pelajaran";
        if (code.startsWith("REF")) return "Referensi";
        if (code.startsWith("KOM")) return "Komik";
        return "Lainnya";
      })
    ),
  ];
  return ["all", ...cats];
});

export const filteredBooks = computed(() => {
  let result = books.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (book) =>
        book.judul?.toLowerCase().includes(query) ||
        book.kode_buku?.toLowerCase().includes(query) ||
        book.penerbit?.toLowerCase().includes(query) ||
        book.penulis?.toLowerCase().includes(query)
    );
  }

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
  return loans.value.filter(
    (loan) => loan.status === "dipinjam" || loan.status === "terlambat"
  );
});

export const dashboardStats = computed(() => {
  const totalBooks = books.value.reduce(
    (acc, book) => acc + (book.stok_total || 0),
    0
  );
  const availableBooks = books.value.reduce(
    (acc, book) => acc + (book.stok_tersedia || 0),
    0
  );
  const borrowedBooks = totalBooks - availableBooks;
  const totalBorrowers = borrowers.value.length;
  const activeLoansCount = activeLoans.value.length;
  const overdueCount = loans.value.filter(
    (loan) => loan.status === "terlambat"
  ).length;

  return {
    totalBooks,
    borrowedBooks,
    availableBooks,
    totalBorrowers,
    activeLoansCount,
    overdueCount,
  };
});

// ==========================================
// ACTIONS - Book Management (via REST API)
// ==========================================
export async function addBook(bookData) {
  const payload = {
    kode_buku: bookData.code || bookData.kode_buku,
    judul: bookData.title || bookData.judul,
    penerbit: bookData.publisher || bookData.penerbit,
    penulis: bookData.author || bookData.penulis,
    tahun_terbit: bookData.year || bookData.tahun_terbit,
    stok_total: bookData.stock || bookData.stok_total || 0,
    stok_tersedia: bookData.stock || bookData.stok_tersedia || 0,
  };

  const result = await api("/books", { method: "POST", body: payload });
  books.value = [...books.value, result.data];
  return result.data;
}

export async function updateBook(kode_buku, bookData) {
  const result = await api(`/books/${encodeURIComponent(kode_buku)}`, {
    method: "PUT",
    body: bookData,
  });
  books.value = books.value.map((book) =>
    book.kode_buku === kode_buku ? result.data : book
  );
  return result.data;
}

export async function deleteBook(kode_buku) {
  await api(`/books/${encodeURIComponent(kode_buku)}`, { method: "DELETE" });
  books.value = books.value.filter((book) => book.kode_buku !== kode_buku);
}

// ==========================================
// ACTIONS - Borrower Management (via REST API)
// ==========================================
export async function addBorrower(borrowerData) {
  const payload = {
    nisn: borrowerData.nisn,
    nama_siswa: borrowerData.name || borrowerData.nama_siswa,
    kelas: borrowerData.class || borrowerData.kelas,
  };

  const result = await api("/borrowers", { method: "POST", body: payload });
  borrowers.value = [...borrowers.value, result.data];
  return result.data;
}

export function searchBorrower(query) {
  const q = query.toLowerCase();
  return borrowers.value.filter(
    (siswa) =>
      siswa.nama_siswa?.toLowerCase().includes(q) ||
      siswa.nisn?.includes(q) ||
      siswa.kelas?.toLowerCase().includes(q)
  );
}

// ==========================================
// ACTIONS - Loan Management (via REST API)
// ==========================================
export async function borrowBook(nisn, kode_buku) {
  try {
    const result = await api("/loans", {
      method: "POST",
      body: { nisn, kode_buku },
    });

    // Update local state
    loans.value = [...loans.value, result.data];

    // Update stok_tersedia locally
    books.value = books.value.map((b) =>
      b.kode_buku === kode_buku
        ? { ...b, stok_tersedia: Math.max(0, (b.stok_tersedia || 0) - 1) }
        : b
    );

    return { success: true, loan: result.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function returnBook(loanId) {
  try {
    const loan = loans.value.find((l) => l.id === loanId);
    if (!loan) {
      return { success: false, message: "Peminjaman tidak ditemukan" };
    }

    const result = await api(`/loans/${loanId}/return`, { method: "PUT" });

    // Update loan status locally
    loans.value = loans.value.map((l) =>
      l.id === loanId ? result.data : l
    );

    // Update stok_tersedia
    books.value = books.value.map((b) =>
      b.kode_buku === loan.kode_buku
        ? { ...b, stok_tersedia: (b.stok_tersedia || 0) + 1 }
        : b
    );

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
export function getLoanDetails(loanId) {
  const loan = loans.value.find((l) => l.id === loanId);
  if (!loan) return null;

  const borrower = borrowers.value.find((s) => s.nisn === loan.nisn);
  const book = books.value.find((b) => b.kode_buku === loan.kode_buku);

  return {
    ...loan,
    borrowDate: loan.tanggal_pinjam,
    dueDate: loan.tenggat_kembali,
    returnDate: loan.tanggal_kembali_aktual,
    borrowerId: loan.nisn,
    bookId: loan.kode_buku,
    borrower: borrower
      ? {
        id: borrower.nisn,
        nisn: borrower.nisn,
        name: borrower.nama_siswa,
        class: borrower.kelas,
      }
      : null,
    book: book
      ? {
        id: book.kode_buku,
        code: book.kode_buku,
        title: book.judul,
        publisher: book.penerbit,
        author: book.penulis,
        year: book.tahun_terbit,
        stock: book.stok_total,
        available: book.stok_tersedia,
      }
      : null,
    status:
      loan.status === "dipinjam"
        ? "active"
        : loan.status === "terlambat"
          ? "overdue"
          : "returned",
  };
}

export function getActiveLoansByBorrower(nisn) {
  return loans.value
    .filter((loan) => loan.nisn === nisn && loan.status !== "kembali")
    .map((loan) => getLoanDetails(loan.id));
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

export function isOverdue(dueDate) {
  return new Date(dueDate) < new Date();
}

export function getBookByCode(kode_buku) {
  return books.value.find((b) => b.kode_buku === kode_buku);
}

export function getBorrowerByNisn(nisn) {
  return borrowers.value.find((s) => s.nisn === nisn);
}
