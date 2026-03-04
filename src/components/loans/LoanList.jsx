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
      class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        class="modal-content overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spectrum Top Bar */}
        <div class="h-1 spectrum-bar"></div>

        {/* Header */}
        <div class="px-6 py-4 border-b border-zedd-silver/40 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 class="text-xl font-bold text-zedd-carbon">Pinjam Buku</h2>
            <p class="text-sm text-zedd-steel">Catat peminjaman buku baru</p>
          </div>
          <button
            onClick={onClose}
            class="p-2 hover:bg-zedd-glass rounded-full text-zedd-steel hover:text-zedd-violet transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>

        {/* Stepper */}
        <div class="px-6 py-3 bg-zedd-glass border-b border-zedd-silver/40 shrink-0">
          <div class="flex items-center gap-2 text-sm">
            <div class={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${step >= 1 ? "bg-zedd-violet text-white" : "bg-zedd-silver text-zedd-steel"}`}>1</div>
            <span class={`font-medium ${step >= 1 ? "text-zedd-violet" : "text-zedd-steel"}`}>Pilih Siswa</span>
            <div class="w-8 h-px bg-zedd-silver mx-1"></div>
            <div class={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${step >= 2 ? "bg-zedd-violet text-white" : "bg-zedd-silver text-zedd-steel"}`}>2</div>
            <span class={`font-medium ${step >= 2 ? "text-zedd-violet" : "text-zedd-steel"}`}>Pilih Buku</span>
          </div>
        </div>

        {/* Content */}
        <div class="p-6 overflow-y-auto flex-1">
          {message.text && (
            <div class={`mb-4 p-4 rounded-xl flex items-center gap-3 text-sm animate-slide-up
              ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.type === "success" ? <CheckCircle class="w-5 h-5 flex-shrink-0" /> : <AlertTriangle class="w-5 h-5 flex-shrink-0" />}
              {message.text}
            </div>
          )}

          {step === 1 ? (
            <div class="space-y-4">
              <div class="relative group">
                <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zedd-steel group-focus-within:text-zedd-violet transition-colors" />
                <input
                  type="text"
                  placeholder="Cari nama siswa atau NISN..."
                  value={borrowerSearch}
                  onInput={(e) => setBorrowerSearch(e.target.value)}
                  class="input pl-11"
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
                        class="w-full p-3 rounded-xl border border-zedd-silver/40 hover:border-zedd-violet/30 hover:bg-zedd-violet/[0.02] hover:shadow-sm transition-all flex items-center gap-4 text-left group"
                      >
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-zedd-violet/10 to-zedd-blue/10 flex items-center justify-center text-zedd-violet font-bold group-hover:scale-105 transition-transform border border-zedd-violet/20">
                          {siswa.nama_siswa?.charAt(0) || "?"}
                        </div>
                        <div class="flex-1">
                          <p class="font-semibold text-zedd-carbon group-hover:text-zedd-violet transition-colors">{siswa.nama_siswa}</p>
                          <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-xs font-medium text-zedd-steel bg-zedd-glass px-1.5 py-0.5 rounded">Kelas {siswa.kelas}</span>
                            <span class="text-xs text-zedd-steel">NISN: {siswa.nisn}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div class="text-center py-10">
                    <div class="w-16 h-16 bg-zedd-glass rounded-full flex items-center justify-center mx-auto mb-3 border border-zedd-silver/60">
                      <User class="w-8 h-8 text-zedd-steel/30" />
                    </div>
                    {borrowerSearch.length > 1 ? (
                      <>
                        <p class="text-zedd-carbon font-medium">Siswa tidak ditemukan</p>
                        <p class="text-sm text-zedd-steel mt-1">Coba kata kunci pencarian lain</p>
                      </>
                    ) : (
                      <p class="text-zedd-steel text-sm">Ketik nama atau NISN untuk mulai mencari...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div class="space-y-5">
              <div class="bg-zedd-violet/5 border border-zedd-violet/15 p-4 rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white border border-zedd-violet/20 flex items-center justify-center text-zedd-violet font-bold shadow-sm">
                    {selectedBorrower?.nama_siswa?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p class="text-xs text-zedd-violet font-semibold uppercase tracking-wider mb-0.5">Peminjam</p>
                    <p class="font-bold text-zedd-carbon">{selectedBorrower?.nama_siswa}</p>
                  </div>
                </div>
                <button onClick={() => setStep(1)} class="px-3 py-1.5 text-xs font-medium text-zedd-violet bg-white border border-zedd-violet/20 rounded-lg hover:bg-zedd-violet/5 transition-colors">Ganti</button>
              </div>

              <div class="relative group">
                <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zedd-steel group-focus-within:text-zedd-violet transition-colors" />
                <input
                  type="text"
                  placeholder="Cari judul buku, kode, atau penerbit..."
                  value={bookSearch}
                  onInput={(e) => setBookSearch(e.target.value)}
                  class="input pl-11"
                  autoFocus
                />
              </div>

              <div class="space-y-3 mt-4">
                {availableBooks.length > 0 ? (
                  availableBooks.map((book) => (
                    <button
                      key={book.kode_buku}
                      onClick={() => handleSelectBook(book)}
                      class={`w-full p-4 rounded-xl border transition-all flex items-start gap-4 text-left group
                        ${selectedBook?.kode_buku === book.kode_buku
                          ? "border-zedd-violet bg-zedd-violet/5 ring-1 ring-zedd-violet shadow-sm"
                          : "border-zedd-silver/40 bg-white hover:border-zedd-violet/30 hover:shadow-sm"
                        }`}
                    >
                      <div class={`w-12 h-16 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 border transition-colors
                        ${selectedBook?.kode_buku === book.kode_buku
                          ? "bg-white border-zedd-violet/20 text-zedd-violet"
                          : "bg-zedd-glass border-zedd-silver/60 text-zedd-steel group-hover:bg-zedd-violet/5 group-hover:text-zedd-violet"
                        }`}>
                        <BookOpen class="w-6 h-6" />
                      </div>
                      <div class="flex-1 min-w-0 py-0.5">
                        <div class="flex justify-between items-start gap-2">
                          <h4 class={`font-bold text-sm leading-tight transition-colors ${selectedBook?.kode_buku === book.kode_buku ? "text-zedd-carbon" : "text-zedd-carbon group-hover:text-zedd-violet"}`}>
                            {book.judul}
                          </h4>
                          {selectedBook?.kode_buku === book.kode_buku && <CheckCircle class="w-5 h-5 text-zedd-violet flex-shrink-0" />}
                        </div>
                        <div class="flex items-center gap-2 mt-1.5 mb-2">
                          <span class="text-[10px] font-mono font-medium bg-zedd-glass text-zedd-steel px-1.5 py-0.5 rounded border border-zedd-silver/40">{book.kode_buku}</span>
                          <span class="text-xs text-zedd-steel truncate max-w-[150px]">{book.penerbit}</span>
                        </div>
                        <span class={`text-xs font-medium ${selectedBook?.kode_buku === book.kode_buku ? "text-zedd-violet" : "text-emerald-600"}`}>Stok: {book.stok_tersedia}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div class="text-center py-12 bg-zedd-glass rounded-xl border border-dashed border-zedd-silver">
                    <BookOpen class="w-10 h-10 text-zedd-steel/30 mx-auto mb-2" />
                    <p class="text-zedd-carbon font-medium text-sm">Buku tidak ditemukan</p>
                    <p class="text-zedd-steel text-xs mt-1">Coba kata kunci lain</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div class="px-6 py-4 border-t border-zedd-silver/40 flex gap-3 bg-zedd-glass shrink-0">
          <button onClick={onClose} class="btn btn-ghost flex-1 bg-white border border-zedd-silver/60">Batal</button>

          {step === 2 && (
            <button
              onClick={handleSubmit}
              disabled={!selectedBook}
              class="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
        return (<span class="badge badge-success"><Clock class="w-3 h-3 mr-1" /> Dipinjam</span>);
      case "overdue":
        return (<span class="badge badge-danger"><AlertTriangle class="w-3 h-3 mr-1" /> Terlambat</span>);
      case "returned":
        return (<span class="badge badge-info"><CheckCircle class="w-3 h-3 mr-1" /> Dikembalikan</span>);
      default:
        return null;
    }
  };

  return (
    <div class="space-y-6 animate-fade-in pb-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="section-title">
            <ClipboardList class="w-7 h-7 text-zedd-violet" />
            Daftar Peminjaman
          </h1>
          <p class="text-zedd-steel -mt-4 ml-10">Kelola peminjaman buku perpustakaan</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} class="btn btn-accent">
          <BookMarked class="w-5 h-5" />
          Pinjam Buku
        </button>
      </div>

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
                ? "bg-zedd-violet text-white shadow-zedd"
                : "bg-white text-zedd-steel border border-zedd-silver/60 hover:bg-zedd-glass hover:text-zedd-violet"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

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
                <tr key={loan.id} class="hover:bg-zedd-glass/50 transition-colors">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-zedd-violet/10 flex items-center justify-center text-zedd-violet font-bold text-sm border border-zedd-violet/15">
                        {loan.borrower?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p class="font-medium text-zedd-carbon">{loan.borrower?.name}</p>
                        <p class="text-xs text-zedd-steel">Kelas {loan.borrower?.class}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded bg-zedd-violet/5 flex items-center justify-center text-zedd-violet border border-zedd-violet/10">
                        <BookOpen class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="font-medium text-zedd-carbon text-sm">{loan.book?.title}</p>
                        <p class="text-xs text-zedd-steel font-mono">{loan.book?.code}</p>
                      </div>
                    </div>
                  </td>
                  <td><p class="text-zedd-steel text-sm">{formatDate(loan.borrowDate)}</p></td>
                  <td><p class="text-zedd-steel text-sm">{formatDate(loan.dueDate)}</p></td>
                  <td>{getStatusBadge(loan.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLoans.length === 0 && (
          <div class="py-12 text-center">
            <ClipboardList class="w-12 h-12 text-zedd-steel/20 mb-3 mx-auto" />
            <p class="text-zedd-steel">Tidak ada data peminjaman</p>
          </div>
        )}
      </div>

      <LoanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
