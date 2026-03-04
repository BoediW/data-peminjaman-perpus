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

  const activeLoansWithDetails = activeLoans.value.map((loan) =>
    getLoanDetails(loan.id),
  ).filter(Boolean);

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
      <div class="mb-6">
        <h1 class="section-title">
          <RotateCcw class="w-7 h-7 text-zedd-violet" />
          Pengembalian Buku
        </h1>
        <p class="text-zedd-steel -mt-4 ml-10">
          Cari peminjam dan proses pengembalian buku
        </p>
      </div>

      {message.text && (
        <div
          class={`p-4 rounded-xl flex items-center gap-3 animate-slide-up
          ${message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
            }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 class="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle class="w-5 h-5 text-red-600" />
          )}
          <p class="font-medium">{message.text}</p>
        </div>
      )}

      <div class="card p-4">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zedd-steel" />
          <input
            type="text"
            placeholder="Cari nama peminjam, NISN, atau judul buku..."
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            class="input pl-12"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-zedd-violet/5 rounded-xl p-4 border border-zedd-violet/15">
          <div class="flex items-center gap-3">
            <Clock class="w-8 h-8 text-zedd-violet" />
            <div>
              <p class="text-sm text-zedd-violet font-medium">Peminjaman Aktif</p>
              <p class="text-2xl font-bold text-zedd-carbon">
                {activeLoansWithDetails.filter((l) => l.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div class="bg-red-50 rounded-xl p-4 border border-red-200">
          <div class="flex items-center gap-3">
            <AlertTriangle class="w-8 h-8 text-red-500" />
            <div>
              <p class="text-sm text-red-600 font-medium">Terlambat Kembali</p>
              <p class="text-2xl font-bold text-zedd-carbon">
                {activeLoansWithDetails.filter((l) => l.status === "overdue").length}
              </p>
            </div>
          </div>
        </div>
        <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <div class="flex items-center gap-3">
            <CheckCircle2 class="w-8 h-8 text-emerald-500" />
            <div>
              <p class="text-sm text-emerald-600 font-medium">Total Peminjam</p>
              <p class="text-2xl font-bold text-zedd-carbon">
                {new Set(activeLoansWithDetails.map((l) => l.borrowerId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="font-display font-semibold text-lg text-zedd-carbon">
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
                  <div class="w-16 h-24 bg-zedd-violet/5 rounded-lg flex items-center justify-center text-zedd-violet shadow-sm border border-zedd-violet/10">
                    <BookOpen class="w-8 h-8" />
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 rounded-full bg-zedd-violet/10 flex items-center justify-center text-zedd-violet font-bold text-sm border border-zedd-violet/15">
                        {loan.borrower?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p class="font-medium text-zedd-carbon text-sm">
                          {loan.borrower?.name}
                        </p>
                        <p class="text-xs text-zedd-steel">
                          Kelas {loan.borrower?.class}
                        </p>
                      </div>
                    </div>

                    <h3 class="font-semibold text-zedd-carbon mb-2 line-clamp-1">
                      {loan.book?.title}
                    </h3>

                    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zedd-steel mb-3">
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
                        class="btn btn-primary btn-sm"
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
          <div class="text-center py-12">
            <CheckCircle2 class="w-16 h-16 text-zedd-steel/20 mb-4 mx-auto" />
            <h3 class="text-lg font-medium text-zedd-steel mb-2">
              {searchQuery
                ? "Tidak ada hasil ditemukan"
                : "Semua buku sudah dikembalikan"}
            </h3>
            <p class="text-zedd-steel/60">
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
