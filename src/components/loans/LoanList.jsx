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
  X,
  Sparkles,
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

    const result = await borrowBook(
      selectedBorrower.nisn,
      selectedBook.kode_buku,
    );

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
      className="fixed inset-0 bg-nerissa-onyx/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-nerissa-midnight border border-white/10 rounded-nerissa-lg shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/5 shrink-0">
          <div>
            <h2 className="text-xl font-display font-black text-white tracking-tight uppercase">
              Pinjam Buku
            </h2>
            <p className="text-xs text-nerissa-teal uppercase tracking-widest font-bold">
              Archivist Protocol
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 bg-nerissa-onyx/30 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-black transition-all ${step >= 1 ? "bg-nerissa-teal text-nerissa-onyx shadow-nerissa" : "bg-white/10 text-gray-500"}`}
            >
              1
            </div>
            <span
              className={`font-bold text-xs uppercase tracking-widest ${step >= 1 ? "text-white" : "text-gray-500"}`}
            >
              Pilih Siswa
            </span>
            <div className="w-8 h-px bg-white/10 mx-2"></div>
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-black transition-all ${step >= 2 ? "bg-nerissa-teal text-nerissa-onyx shadow-nerissa" : "bg-white/10 text-gray-500"}`}
            >
              2
            </div>
            <span
              className={`font-bold text-xs uppercase tracking-widest ${step >= 2 ? "text-white" : "text-gray-500"}`}
            >
              Pilih Buku
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {message.text && (
            <div
              className={`mb-4 p-4 rounded-nerissa flex items-center gap-3 text-sm animate-slide-up font-bold
              ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              {message.text}
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Select Borrower */
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-nerissa-teal transition-colors" />
                <input
                  type="text"
                  placeholder="Cari nama siswa atau NISN..."
                  value={borrowerSearch}
                  onInput={(e) => setBorrowerSearch(e.target.value)}
                  className="input pl-11 !bg-white/5 border-white/10 focus:border-nerissa-teal/50"
                  autoFocus
                />
              </div>

              <div className="space-y-2 mt-2">
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {searchResults.map((siswa) => (
                      <button
                        key={siswa.nisn}
                        onClick={() => handleSelectBorrower(siswa)}
                        className="w-full p-3 rounded-nerissa border border-white/5 hover:border-nerissa-teal/30 hover:bg-white/5 transition-all flex items-center gap-4 text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-nerissa-teal/10 flex items-center justify-center text-nerissa-teal font-bold group-hover:scale-110 transition-transform">
                          {siswa.nama_siswa?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white group-hover:text-nerissa-teal transition-colors">
                            {siswa.nama_siswa}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-nerissa-onyx bg-nerissa-teal/80 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              Kelas {siswa.kelas}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">
                              NISN: {siswa.nisn}
                            </span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-nerissa-teal transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    {borrowerSearch.length > 1 ? (
                      <>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                          Siswa tidak ditemukan
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Ketik nama atau NISN untuk mulai mencari...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Step 2: Select Book */
            <div className="space-y-5">
              {/* Selected Borrower Card */}
              <div className="bg-nerissa-teal/5 border border-nerissa-teal/20 p-4 rounded-nerissa flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-nerissa-teal text-nerissa-onyx flex items-center justify-center font-bold shadow-nerissa">
                    {selectedBorrower?.nama_siswa?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-[10px] text-nerissa-teal font-black uppercase tracking-widest mb-0.5">
                      Peminjam
                    </p>
                    <p className="font-bold text-white">
                      {selectedBorrower?.nama_siswa}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/10 rounded-full hover:bg-white/5 hover:text-white transition-colors"
                >
                  Ganti
                </button>
              </div>

              {/* Book Search */}
              <div class="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-nerissa-teal transition-colors" />
                <input
                  type="text"
                  placeholder="Cari judul buku, kode, atau penerbit..."
                  value={bookSearch}
                  onInput={(e) => setBookSearch(e.target.value)}
                  className="input pl-11 !bg-white/5 border-white/10 focus:border-nerissa-teal/50"
                  autoFocus
                />
              </div>

              {/* Available Books */}
              <div className="space-y-3 mt-4">
                {availableBooks.length > 0 ? (
                  availableBooks.map((book) => (
                    <button
                      key={book.kode_buku}
                      onClick={() => handleSelectBook(book)}
                      className={`w-full p-4 rounded-nerissa border transition-all flex items-start gap-4 text-left group relative overflow-hidden
                          ${
                            selectedBook?.kode_buku === book.kode_buku
                              ? "border-nerissa-teal bg-nerissa-teal/10 shadow-nerissa"
                              : "border-white/5 bg-white/5 hover:border-nerissa-teal/30 hover:bg-white/10"
                          }`}
                    >
                      {/* Book Icon / Cover Placeholder */}
                      <div
                        className={`w-12 h-16 rounded flex items-center justify-center shadow-lg flex-shrink-0 border transition-colors
                            ${
                              selectedBook?.kode_buku === book.kode_buku
                                ? "bg-nerissa-teal text-nerissa-onyx border-nerissa-teal"
                                : "bg-nerissa-onyx border-white/10 text-gray-500 group-hover:text-nerissa-teal"
                            }
                        `}
                      >
                        <BookOpen className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 py-0.5 z-10 relative">
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            className={`font-bold text-sm leading-tight transition-colors line-clamp-1 ${selectedBook?.kode_buku === book.kode_buku ? "text-white" : "text-gray-300 group-hover:text-white"}`}
                          >
                            {book.judul}
                          </h4>
                          {selectedBook?.kode_buku === book.kode_buku && (
                            <CheckCircle className="w-5 h-5 text-nerissa-teal flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2 mb-2">
                          <span className="text-[10px] font-mono font-medium bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/5">
                            {book.kode_buku}
                          </span>
                        </div>

                        <div className="flex items-center text-xs">
                          <span
                            className={`font-black uppercase tracking-widest text-[10px] ${selectedBook?.kode_buku === book.kode_buku ? "text-nerissa-teal" : "text-gray-500"}`}
                          >
                            Stok: {book.stok_tersedia}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-nerissa">
                    <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                      Buku tidak ditemukan
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex gap-3 bg-white/5 shrink-0">
          <button onClick={onClose} className="btn btn-ghost flex-1">
            Batal
          </button>

          {step === 1 && (
            <button
              disabled
              className="btn btn-primary flex-1 opacity-50 cursor-not-allowed"
            >
              Pilih Buku
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleSubmit}
              disabled={!selectedBook}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookMarked className="w-4 h-4" />
              Konfirmasi
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
          <span className="badge badge-success">
            <div className="w-1.5 h-1.5 rounded-full bg-nerissa-teal shadow-nerissa mr-2 animate-pulse"></div>
            Dipinjam
          </span>
        );
      case "overdue":
        return (
          <span className="badge badge-danger">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mr-2"></div>
            Terlambat
          </span>
        );
      case "returned":
        return (
          <span className="badge badge-info">
            <CheckCircle className="w-3 h-3 mr-1" />
            Dikembalikan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-nerissa-teal/40"></div>
            <span className="text-[10px] font-black text-nerissa-teal uppercase tracking-[0.4em] leading-none">
              Circulation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase">
            Data Peminjaman
          </h1>
          <p className="text-gray-500 text-sm mt-3 font-medium tracking-tight">
            Memantau aliran pengetahuan di seluruh sistem.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary group h-12 px-8"
        >
          <BookMarked className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          <span>Pinjam Buku Baru</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {[
          { id: "all", label: "Semua Arsip" },
          { id: "active", label: "Sedang Dipinjam" },
          { id: "overdue", label: "Terlambat" },
          { id: "returned", label: "Riwayat Kembali" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2
              ${
                filter === f.id
                  ? "bg-nerissa-teal border-nerissa-teal text-nerissa-onyx shadow-nerissa"
                  : "bg-nerissa-onyx/50 text-gray-500 border-white/5 hover:border-white/20 hover:text-gray-300"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loans Table */}
      <div className="card overflow-hidden bg-nerissa-midnight/40 backdrop-blur-xl border-white/5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="table">
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
              {filteredLoans.map(
                (loan) =>
                  loan && (
                    <tr
                      key={loan.id}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-nerissa bg-white/5 border border-white/10 flex items-center justify-center text-nerissa-teal font-bold text-sm group-hover:scale-110 transition-transform shadow-inner">
                            {loan.borrower?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">
                              {loan.borrower?.name}
                            </p>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                              Kelas {loan.borrower?.class}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-12 rounded bg-black/40 border border-white/10 flex items-center justify-center text-gray-600 shadow-lg">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-300 text-sm group-hover:text-nerissa-teal transition-colors line-clamp-1">
                              {loan.book?.title}
                            </p>
                            <p className="text-[10px] text-gray-600 font-mono mt-1">
                              {loan.book?.code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">
                          {formatDate(loan.borrowDate)}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">
                          {formatDate(loan.dueDate)}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(loan.status)}
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        </div>

        {filteredLoans.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center opacity-50">
            <ClipboardList className="w-16 h-16 text-gray-600 mb-4 animate-pulse" />
            <p className="text-gray-500 font-display font-black uppercase tracking-[0.3em]">
              Tidak ada data peminjaman
            </p>
          </div>
        )}
      </div>

      {/* Loan Modal */}
      <LoanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
