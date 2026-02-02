import { useState } from "preact/hooks";
import { createPortal } from "preact/compat";
import {
  ClipboardList,
  Search,
  BookMarked,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-preact";
import {
  loans,
  books,
  borrowBook,
  searchBorrower,
  formatDate,
  getLoanDetails,
} from "../../stores/libraryStore";

function LoanModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [borrowerSearch, setBorrowerSearch] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookSearch, setBookSearch] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const searchResults =
    borrowerSearch.length > 1 ? searchBorrower(borrowerSearch) : [];

  const availableBooks = books.value.filter((book) => {
    const available = (book.stok_tersedia || 0) > 0;
    const matchesSearch =
      book.judul?.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.kode_buku?.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.penerbit?.toLowerCase().includes(bookSearch.toLowerCase());
    return available && (bookSearch === "" || matchesSearch);
  });

  const handleSelectBorrower = (borrower) => {
    setSelectedBorrower(borrower);
    setStep(2);
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleSubmit = async () => {
    if (!selectedBorrower || !selectedBook) return;

    const result = await borrowBook(selectedBorrower.nisn, selectedBook.kode_buku);

    if (result.success) {
      setMessage({ type: "success", text: "Peminjaman berhasil dicatat!" });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  const resetForm = () => {
    setStep(1);
    setBorrowerSearch("");
    setSelectedBorrower(null);
    setSelectedBook(null);
    setBookSearch("");
    setMessage({ type: "", text: "" });
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        class="modal-content overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Pinjam Buku</h2>
            <p class="text-sm text-gray-500">Catat peminjaman buku baru</p>
          </div>
          <button
            onClick={onClose}
            class="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Stepper */}
        <div class="px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
          <div class="flex items-center gap-2 text-sm">
            <div
              class={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${step >= 1 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              1
            </div>
            <span
              class={`font-medium ${step >= 1 ? "text-primary-800" : "text-gray-500"}`}
            >
              Pilih Siswa
            </span>
            <div class="w-8 h-px bg-gray-300 mx-1"></div>
            <div
              class={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${step >= 2 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </div>
            <span
              class={`font-medium ${step >= 2 ? "text-primary-800" : "text-gray-500"}`}
            >
              Pilih Buku
            </span>
          </div>
        </div>

        {/* Content */}
        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {message.text && (
            <div
              class={`mb-4 p-4 rounded-xl flex items-center gap-3 text-sm animate-slide-up
              ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
            >
              {message.type === "success" ? (
                <CheckCircle class="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle class="w-5 h-5 flex-shrink-0" />
              )}
              {message.text}
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Select Borrower */
            <div class="space-y-4">
              <div class="relative group">
                <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari nama siswa atau NISN..."
                  value={borrowerSearch}
                  onInput={(e) => setBorrowerSearch(e.target.value)}
                  class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                  autoFocus
                />
              </div>

              <div class="space-y-2 mt-2">
                {searchResults.length > 0 ? (
                  <div class="grid grid-cols-1 gap-2">
                    {searchResults.map((siswa) => (
                      <button
                        key={siswa.nisn}
                        onClick={() => handleSelectBorrower(siswa)}
                        class="w-full p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-sm transition-all flex items-center gap-4 text-left group"
                      >
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold group-hover:scale-105 transition-transform shadow-inner">
                          {siswa.nama_siswa?.charAt(0) || "?"}
                        </div>
                        <div class="flex-1">
                          <p class="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                            {siswa.nama_siswa}
                          </p>
                          <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              Kelas {siswa.kelas}
                            </span>
                            <span class="text-xs text-gray-400">
                              NISN: {siswa.nisn}
                            </span>
                          </div>
                        </div>
                        <div class="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-primary-600 shadow-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="w-4 h-4"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div class="text-center py-10">
                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User class="w-8 h-8 text-gray-300" />
                    </div>
                    {borrowerSearch.length > 1 ? (
                      <>
                        <p class="text-gray-900 font-medium">
                          Siswa tidak ditemukan
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                          Coba kata kunci pencarian lain
                        </p>
                      </>
                    ) : (
                      <p class="text-gray-400 text-sm">
                        Ketik nama atau NISN untuk mulai mencari...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Step 2: Select Book */
            <div class="space-y-5">
              {/* Selected Borrower Card */}
              <div class="bg-gradient-to-r from-primary-50 to-white border border-primary-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white border-2 border-primary-100 flex items-center justify-center text-primary-700 font-bold shadow-sm">
                    {selectedBorrower?.nama_siswa?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p class="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-0.5">
                      Peminjam
                    </p>
                    <p class="font-bold text-gray-900">
                      {selectedBorrower?.nama_siswa}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  class="px-3 py-1.5 text-xs font-medium text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Ganti
                </button>
              </div>

              {/* Book Search */}
              <div class="relative group">
                <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari judul buku, kode, atau penerbit..."
                  value={bookSearch}
                  onInput={(e) => setBookSearch(e.target.value)}
                  class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                  autoFocus
                />
              </div>

              {/* Available Books */}
              <div class="space-y-3 mt-4">
                {availableBooks.length > 0 ? (
                  availableBooks.map((book) => (
                    <button
                      key={book.kode_buku}
                      onClick={() => handleSelectBook(book)}
                      class={`w-full p-4 rounded-xl border transition-all flex items-start gap-4 text-left group
                          ${selectedBook?.kode_buku === book.kode_buku
                          ? "border-accent-500 bg-accent-50/50 ring-1 ring-accent-500 shadow-sm"
                          : "border-gray-100 bg-white hover:border-primary-300 hover:shadow-md"
                        }`}
                    >
                      {/* Book Icon / Cover Placeholder */}
                      <div
                        class={`w-12 h-16 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 border transition-colors
                            ${selectedBook?.kode_buku === book.kode_buku
                            ? "bg-white border-accent-200 text-accent-600"
                            : "bg-gray-50 border-gray-100 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500 group-hover:border-primary-100"
                          }
                        `}
                      >
                        <BookOpen class="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div class="flex-1 min-w-0 py-0.5">
                        <div class="flex justify-between items-start gap-2">
                          <h4
                            class={`font-bold text-sm leading-tight transition-colors ${selectedBook?.kode_buku === book.kode_buku ? "text-gray-900" : "text-gray-900 group-hover:text-primary-700"}`}
                          >
                            {book.judul}
                          </h4>
                          {selectedBook?.kode_buku === book.kode_buku && (
                            <CheckCircle class="w-5 h-5 text-accent-500 flex-shrink-0" />
                          )}
                        </div>

                        <div class="flex items-center gap-2 mt-1.5 mb-2">
                          <span class="text-[10px] font-mono font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                            {book.kode_buku}
                          </span>
                          <span class="text-xs text-gray-500 truncate max-w-[150px]">
                            {book.penerbit}
                          </span>
                        </div>

                        <div class="flex items-center text-xs">
                          <span
                            class={`font-medium ${selectedBook?.kode_buku === book.kode_buku ? "text-accent-700" : "text-green-600"}`}
                          >
                            Stok: {book.stok_tersedia}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <BookOpen class="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p class="text-gray-900 font-medium text-sm">
                      Buku tidak ditemukan
                    </p>
                    <p class="text-gray-500 text-xs mt-1">
                      Coba kata kunci lain
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div class="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50 shrink-0">
          <button
            onClick={onClose}
            class="btn btn-ghost flex-1 bg-white border border-gray-200"
          >
            Batal
          </button>

          {step === 1 && (
            <button
              disabled
              class="btn btn-primary flex-1 opacity-50 cursor-not-allowed"
            >
              Pilih Buku{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 ml-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleSubmit}
              disabled={!selectedBook}
              class="btn btn-accent flex-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-500/20"
            >
              <BookMarked class="w-5 h-5" />
              Konfirmasi Pinjam
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function LoanList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const allLoansWithDetails = loans.value.map((loan) =>
    getLoanDetails(loan.id),
  );

  const filteredLoans = allLoansWithDetails.filter((loan) => {
    if (!loan) return false;
    if (filter === "all") return true;
    if (filter === "active") return loan.status === "active";
    if (filter === "overdue") return loan.status === "overdue";
    if (filter === "returned") return loan.status === "returned";
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span class="badge badge-success">
            <Clock class="w-3 h-3 mr-1" />
            Dipinjam
          </span>
        );
      case "overdue":
        return (
          <span class="badge badge-danger">
            <AlertTriangle class="w-3 h-3 mr-1" />
            Terlambat
          </span>
        );
      case "returned":
        return (
          <span class="badge badge-info">
            <CheckCircle class="w-3 h-3 mr-1" />
            Dikembalikan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div class="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="section-title">
            <ClipboardList class="w-7 h-7 text-primary-600" />
            Daftar Peminjaman
          </h1>
          <p class="text-gray-500 -mt-4 ml-10">
            Kelola peminjaman buku perpustakaan
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} class="btn btn-accent">
          <BookMarked class="w-5 h-5" />
          Pinjam Buku
        </button>
      </div>

      {/* Filters */}
      <div class="flex flex-wrap gap-2">
        {[
          { id: "all", label: "Semua" },
          { id: "active", label: "Dipinjam" },
          { id: "overdue", label: "Terlambat" },
          { id: "returned", label: "Dikembalikan" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            class={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${filter === f.id
                ? "bg-primary-800 text-white"
                : "bg-white text-gray-600 border border-base-300 hover:bg-base-100"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loans Table */}
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Peminjam</th>
                <th>Buku</th>
                <th>Tgl Pinjam</th>
                <th>Tenggat</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => loan && (
                <tr key={loan.id} class="hover:bg-base-100 transition-colors">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        {loan.borrower?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">
                          {loan.borrower?.name}
                        </p>
                        <p class="text-xs text-gray-500">
                          Kelas {loan.borrower?.class}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded bg-primary-50 flex items-center justify-center text-primary-600">
                        <BookOpen class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 text-sm">
                          {loan.book?.title}
                        </p>
                        <p class="text-xs text-gray-500 font-mono">
                          {loan.book?.code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-gray-600 text-sm">
                      {formatDate(loan.borrowDate)}
                    </p>
                  </td>
                  <td>
                    <p class="text-gray-600 text-sm">
                      {formatDate(loan.dueDate)}
                    </p>
                  </td>
                  <td>{getStatusBadge(loan.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLoans.length === 0 && (
          <div class="empty-state py-12">
            <ClipboardList class="w-12 h-12 text-gray-300 mb-3" />
            <p class="text-gray-500">Tidak ada data peminjaman</p>
          </div>
        )}
      </div>

      {/* Loan Modal */}
      <LoanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
