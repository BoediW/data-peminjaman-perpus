import { useState } from "preact/hooks";
import {
  RotateCcw,
  Search,
  CheckCircle2,
  User,
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-preact";
import {
  activeLoans,
  borrowers,
  returnBook,
  formatDate,
  getLoanDetails,
} from "../../stores/libraryStore";

export default function ReturnBook() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  // Get active loans with full details
  const activeLoansWithDetails = activeLoans.value.map((loan) =>
    getLoanDetails(loan.id),
  ).filter(Boolean);

  // Filter loans based on search
  const filteredLoans = activeLoansWithDetails.filter((loan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      loan.borrower?.name?.toLowerCase().includes(query) ||
      loan.borrower?.nisn?.includes(query) ||
      loan.book?.title?.toLowerCase().includes(query) ||
      loan.book?.code?.toLowerCase().includes(query)
    );
  });

  const handleReturn = async (loan) => {
    setIsProcessing(true);
    setSelectedLoan(loan.id);

    const result = await returnBook(loan.id);

    if (result.success) {
      setMessage({
        type: "success",
        text: `Buku "${loan.book?.title}" berhasil dikembalikan!`,
      });
    } else {
      setMessage({ type: "error", text: result.message });
    }

    setIsProcessing(false);
    setSelectedLoan(null);

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div class="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div class="mb-6">
        <h1 class="section-title">
          <RotateCcw class="w-7 h-7 text-primary-600" />
          Pengembalian Buku
        </h1>
        <p class="text-gray-500 -mt-4 ml-10">
          Cari peminjam dan proses pengembalian buku
        </p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div
          class={`p-4 rounded-xl flex items-center gap-3 animate-slide-up
          ${message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
            }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 class="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle class="w-5 h-5 text-red-600" />
          )}
          <p class="font-medium">{message.text}</p>
        </div>
      )}

      {/* Search */}
      <div class="card p-4">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama peminjam, NISN, atau judul buku..."
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            class="input pl-12"
          />
        </div>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div class="flex items-center gap-3">
            <Clock class="w-8 h-8 text-blue-500" />
            <div>
              <p class="text-sm text-blue-600 font-medium">Peminjaman Aktif</p>
              <p class="text-2xl font-bold text-blue-800">
                {
                  activeLoansWithDetails.filter((l) => l.status === "active")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div class="bg-red-50 rounded-xl p-4 border border-red-100">
          <div class="flex items-center gap-3">
            <AlertTriangle class="w-8 h-8 text-red-500" />
            <div>
              <p class="text-sm text-red-600 font-medium">Terlambat Kembali</p>
              <p class="text-2xl font-bold text-red-800">
                {
                  activeLoansWithDetails.filter((l) => l.status === "overdue")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div class="bg-green-50 rounded-xl p-4 border border-green-100">
          <div class="flex items-center gap-3">
            <CheckCircle2 class="w-8 h-8 text-green-500" />
            <div>
              <p class="text-sm text-green-600 font-medium">Total Peminjam</p>
              <p class="text-2xl font-bold text-green-800">
                {new Set(activeLoansWithDetails.map((l) => l.borrowerId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans List */}
      <div class="space-y-4">
        <h2 class="font-display font-semibold text-lg text-gray-900">
          Daftar Buku yang Belum Dikembalikan
        </h2>

        {filteredLoans.length > 0 ? (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLoans.map((loan) => (
              <div
                key={loan.id}
                class={`card p-5 transition-all duration-200
                  ${loan.status === "overdue" ? "border-red-200 bg-red-50/30" : ""}`}
              >
                <div class="flex items-start gap-4">
                  {/* Book Icon */}
                  <div class="w-16 h-24 bg-primary-100 rounded-lg flex items-center justify-center text-primary-500 shadow-sm">
                    <BookOpen class="w-8 h-8" />
                  </div>

                  <div class="flex-1 min-w-0">
                    {/* Borrower Info */}
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        {loan.borrower?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 text-sm">
                          {loan.borrower?.name}
                        </p>
                        <p class="text-xs text-gray-500">
                          Kelas {loan.borrower?.class}
                        </p>
                      </div>
                    </div>

                    {/* Book Title */}
                    <h3 class="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {loan.book?.title}
                    </h3>

                    {/* Dates */}
                    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                      <span class="flex items-center gap-1">
                        <Calendar class="w-3.5 h-3.5" />
                        Pinjam: {formatDate(loan.borrowDate)}
                      </span>
                      <span
                        class={`flex items-center gap-1 ${loan.status === "overdue" ? "text-red-600 font-medium" : ""}`}
                      >
                        <Clock class="w-3.5 h-3.5" />
                        Tenggat: {formatDate(loan.dueDate)}
                      </span>
                    </div>

                    {/* Status & Action */}
                    <div class="flex items-center justify-between">
                      {loan.status === "overdue" ? (
                        <span class="badge badge-danger">
                          <AlertTriangle class="w-3 h-3 mr-1" />
                          Terlambat
                        </span>
                      ) : (
                        <span class="badge badge-success">
                          <Clock class="w-3 h-3 mr-1" />
                          Dipinjam
                        </span>
                      )}

                      <button
                        onClick={() => handleReturn(loan)}
                        disabled={isProcessing && selectedLoan === loan.id}
                        class="btn btn-accent btn-sm"
                      >
                        {isProcessing && selectedLoan === loan.id ? (
                          <>
                            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Proses...
                          </>
                        ) : (
                          <>
                            <RotateCcw class="w-4 h-4" />
                            Kembalikan
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div class="empty-state py-12">
            <CheckCircle2 class="w-16 h-16 text-gray-300 mb-4" />
            <h3 class="text-lg font-medium text-gray-600 mb-2">
              {searchQuery
                ? "Tidak ada hasil ditemukan"
                : "Semua buku sudah dikembalikan"}
            </h3>
            <p class="text-gray-400">
              {searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Tidak ada peminjaman aktif saat ini"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
