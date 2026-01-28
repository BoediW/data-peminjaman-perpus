import { signal, computed } from "@preact/signals";

// MOCK DATA - Katalog Buku
const initialBooks = [
  {
    id: 1,
    title: "Laskar Pelangi",
    code: "NOV-001",
    publisher: "Bentang Pustaka",
    category: "Novel",
    stock: 5,
    borrowed: 2,
    year: 2005,
  },
  {
    id: 2,
    title: "Bumi Manusia",
    code: "NOV-002",
    publisher: "Hasta Mitra",
    category: "Novel",
    stock: 3,
    borrowed: 3,
    year: 1980,
  },
  {
    id: 3,
    title: "Matematika Kelas 7",
    code: "PLJ-001",
    publisher: "Kemendikbud",
    category: "Pelajaran",
    stock: 20,
    borrowed: 15,
    year: 2023,
  },
  {
    id: 4,
    title: "IPA Terpadu Kelas 8",
    code: "PLJ-002",
    publisher: "Kemendikbud",
    category: "Pelajaran",
    stock: 18,
    borrowed: 10,
    year: 2023,
  },
  {
    id: 5,
    title: "Ensiklopedia Anak Pintar",
    code: "REF-001",
    publisher: "Gramedia",
    category: "Referensi",
    stock: 2,
    borrowed: 0,
    year: 2020,
  },
  {
    id: 6,
    title: "Bahasa Indonesia Kelas 9",
    code: "PLJ-003",
    publisher: "Kemendikbud",
    category: "Pelajaran",
    stock: 25,
    borrowed: 20,
    year: 2023,
  },
  {
    id: 7,
    title: "Sang Pemimpi",
    code: "NOV-003",
    publisher: "Bentang Pustaka",
    category: "Novel",
    stock: 4,
    borrowed: 1,
    year: 2006,
  },
  {
    id: 8,
    title: "Sejarah Indonesia",
    code: "PLJ-004",
    publisher: "Kemendikbud",
    category: "Pelajaran",
    stock: 15,
    borrowed: 8,
    year: 2023,
  },
];

// MOCK DATA - Peminjam (Siswa)
const initialBorrowers = [
  { id: 1, name: "Ahmad Rizki Pratama", class: "7A", nis: "2024001" },
  { id: 2, name: "Siti Nurhaliza", class: "7B", nis: "2024002" },
  { id: 3, name: "Budi Santoso", class: "8A", nis: "2023003" },
  { id: 4, name: "Dewi Anggraini", class: "8B", nis: "2023004" },
  { id: 5, name: "Eka Putri Rahayu", class: "9A", nis: "2022005" },
  { id: 6, name: "Fajar Nugroho", class: "9B", nis: "2022006" },
];

// MOCK DATA - Peminjaman Aktif
const initialLoans = [
  {
    id: 1,
    borrowerId: 1,
    bookId: 1,
    borrowDate: "2026-01-20",
    dueDate: "2026-02-03",
    status: "active",
  },
  {
    id: 2,
    borrowerId: 2,
    bookId: 3,
    borrowDate: "2026-01-22",
    dueDate: "2026-02-05",
    status: "active",
  },
  {
    id: 3,
    borrowerId: 3,
    bookId: 2,
    borrowDate: "2026-01-15",
    dueDate: "2026-01-29",
    status: "overdue",
  },
  {
    id: 4,
    borrowerId: 4,
    bookId: 4,
    borrowDate: "2026-01-25",
    dueDate: "2026-02-08",
    status: "active",
  },
  {
    id: 5,
    borrowerId: 5,
    bookId: 6,
    borrowDate: "2026-01-18",
    dueDate: "2026-02-01",
    status: "active",
  },
];

// SIGNALS - State Management
export const books = signal(initialBooks);
export const borrowers = signal(initialBorrowers);
export const loans = signal(initialLoans);
export const searchQuery = signal("");
export const selectedCategory = signal("all");
export const activeTab = signal("dashboard");

// COMPUTED VALUES
export const categories = computed(() => {
  const cats = [...new Set(books.value.map((book) => book.category))];
  return ["all", ...cats];
});

export const filteredBooks = computed(() => {
  let result = books.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.code.toLowerCase().includes(query) ||
        book.publisher.toLowerCase().includes(query),
    );
  }

  // Filter by category
  if (selectedCategory.value !== "all") {
    result = result.filter((book) => book.category === selectedCategory.value);
  }

  return result;
});

export const activeLoans = computed(() => {
  return loans.value.filter((loan) => loan.status !== "returned");
});

export const dashboardStats = computed(() => {
  const totalBooks = books.value.reduce((acc, book) => acc + book.stock, 0);
  const borrowedBooks = books.value.reduce(
    (acc, book) => acc + book.borrowed,
    0,
  );
  const availableBooks = totalBooks - borrowedBooks;
  const totalBorrowers = borrowers.value.length;
  const activeLoansCount = activeLoans.value.length;
  const overdueCount = loans.value.filter(
    (loan) => loan.status === "overdue",
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

// ACTIONS - Book Management
export function addBook(bookData) {
  const newBook = {
    id: Math.max(...books.value.map((b) => b.id)) + 1,
    ...bookData,
    borrowed: 0,
  };
  books.value = [...books.value, newBook];
  return newBook;
}

export function updateBook(id, bookData) {
  books.value = books.value.map((book) =>
    book.id === id ? { ...book, ...bookData } : book,
  );
}

export function deleteBook(id) {
  books.value = books.value.filter((book) => book.id !== id);
}

// ACTIONS - Borrower Management
export function addBorrower(borrowerData) {
  const newBorrower = {
    id: Math.max(...borrowers.value.map((b) => b.id)) + 1,
    ...borrowerData,
  };
  borrowers.value = [...borrowers.value, newBorrower];
  return newBorrower;
}

export function searchBorrower(query) {
  const q = query.toLowerCase();
  return borrowers.value.filter(
    (borrower) =>
      borrower.name.toLowerCase().includes(q) ||
      borrower.nis.includes(q) ||
      borrower.class.toLowerCase().includes(q),
  );
}

// ACTIONS - Loan Management
export function borrowBook(borrowerId, bookId) {
  const book = books.value.find((b) => b.id === bookId);
  if (!book || book.stock - book.borrowed <= 0) {
    return { success: false, message: "Buku tidak tersedia" };
  }

  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period

  const newLoan = {
    id: Math.max(...loans.value.map((l) => l.id), 0) + 1,
    borrowerId,
    bookId,
    borrowDate: today.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
    status: "active",
  };

  // Update book borrowed count
  books.value = books.value.map((b) =>
    b.id === bookId ? { ...b, borrowed: b.borrowed + 1 } : b,
  );

  loans.value = [...loans.value, newLoan];
  return { success: true, loan: newLoan };
}

export function returnBook(loanId) {
  const loan = loans.value.find((l) => l.id === loanId);
  if (!loan) {
    return { success: false, message: "Peminjaman tidak ditemukan" };
  }

  // Update loan status
  loans.value = loans.value.map((l) =>
    l.id === loanId
      ? {
          ...l,
          status: "returned",
          returnDate: new Date().toISOString().split("T")[0],
        }
      : l,
  );

  // Update book borrowed count
  books.value = books.value.map((b) =>
    b.id === loan.bookId ? { ...b, borrowed: Math.max(0, b.borrowed - 1) } : b,
  );

  return { success: true };
}

export function getLoanDetails(loanId) {
  const loan = loans.value.find((l) => l.id === loanId);
  if (!loan) return null;

  const borrower = borrowers.value.find((b) => b.id === loan.borrowerId);
  const book = books.value.find((b) => b.id === loan.bookId);

  return { ...loan, borrower, book };
}

export function getActiveLoansByBorrower(borrowerId) {
  return loans.value
    .filter(
      (loan) => loan.borrowerId === borrowerId && loan.status !== "returned",
    )
    .map((loan) => getLoanDetails(loan.id));
}

// UTILITY FUNCTIONS
export function formatDate(dateString) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

export function isOverdue(dueDate) {
  return new Date(dueDate) < new Date();
}
