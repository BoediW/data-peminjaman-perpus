import {
  BookOpen,
  Users,
  BookCheck,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Library,
  ArrowRight,
  Clock,
} from "lucide-preact";
import {
  dashboardStats,
  activeLoans,
  books,
  borrowers,
  formatDate,
  getLoanDetails,
} from "../../stores/libraryStore";

function StatCard({ icon: Icon, label, value, color, trend }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
  };

  return (
    <div class="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div class="relative z-10 flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div class={`p-2 rounded-lg ${colorClasses[color]} bg-opacity-50`}>
              <Icon class="w-5 h-5" />
            </div>
            <p class="text-sm font-medium text-gray-500">{label}</p>
          </div>

          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-display font-bold text-gray-900 tracking-tight">
              {value}
            </h3>
          </div>

          {trend && (
            <div class="flex items-center gap-1.5 mt-3 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full border border-green-100">
              <TrendingUp class="w-3 h-3" />
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentLoansTable() {
  const recentLoans = activeLoans.value
    .slice(0, 5)
    .map((loan) => getLoanDetails(loan.id))
    .filter(Boolean);

  return (
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-display font-bold text-lg text-gray-900 flex items-center gap-2">
          <Clock class="w-5 h-5 text-primary-500" />
          Peminjaman Terbaru
        </h3>
        <button class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
          Lihat Semua <ArrowRight class="w-4 h-4" />
        </button>
      </div>

      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Peminjam
              </th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Buku
              </th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {recentLoans.map((loan) => (
              <tr
                key={loan.id}
                class="hover:bg-gray-50/50 transition-colors group"
              >
                <td class="px-6 py-4">
                  <div>
                    <p class="font-semibold text-gray-900 text-sm">
                      {loan.borrower?.name}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5 font-medium bg-gray-100 w-fit px-1.5 py-0.5 rounded">
                      Kelas {loan.borrower?.class}
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-700 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {loan.book?.title}
                    </span>
                    <span class="text-xs text-gray-400 mt-0.5">
                      {formatDate(loan.borrowDate)}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${loan.status === "overdue"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                  >
                    <span
                      class={`w-1.5 h-1.5 rounded-full mr-1.5 ${loan.status === "overdue"
                          ? "bg-red-500"
                          : "bg-emerald-500"
                        }`}
                    ></span>
                    {loan.status === "overdue" ? "Terlambat" : "Dipinjam"}
                  </span>
                </td>
              </tr>
            ))}

            {recentLoans.length === 0 && (
              <tr>
                <td colspan="3" class="px-6 py-12 text-center text-gray-500">
                  Belum ada data peminjaman
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PopularBooks() {
  // Sort by (stok_total - stok_tersedia) to get most borrowed
  const popularBooks = [...books.value]
    .sort((a, b) => {
      const borrowedA = (a.stok_total || 0) - (a.stok_tersedia || 0);
      const borrowedB = (b.stok_total || 0) - (b.stok_tersedia || 0);
      return borrowedB - borrowedA;
    })
    .slice(0, 5);

  return (
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <h3 class="font-display font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp class="w-5 h-5 text-accent-500" />
        Buku Populer
      </h3>
      <div class="space-y-4 flex-1">
        {popularBooks.map((book, index) => {
          const borrowed = (book.stok_total || 0) - (book.stok_tersedia || 0);
          return (
            <div
              key={book.kode_buku}
              class="flex items-center gap-4 p-3 rounded-xl hover:bg-auth-50 border border-transparent hover:border-gray-100 hover:shadow-sm transition-all duration-200 group cursor-default"
            >
              <div
                class={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 relative overflow-hidden
              ${index === 0
                    ? "bg-amber-500 text-white"
                    : index === 1
                      ? "bg-slate-400 text-white"
                      : index === 2
                        ? "bg-orange-400 text-white"
                        : "bg-gray-100 text-gray-500"
                  }`}
              >
                {index + 1}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                  {book.judul}
                </p>
                <div class="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span class="truncate max-w-[120px]">{book.penerbit || "-"}</span>
                  <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span class="font-semibold text-primary-600 bg-primary-50 px-1.5 rounded-md">
                    {borrowed} dipinjam
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {popularBooks.length === 0 && (
          <div class="text-center py-8 text-gray-400 text-sm">
            Belum ada data buku
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const stats = dashboardStats.value;

  return (
    <div class="space-y-8 animate-fade-in pb-8">
      {/* Welcome Header */}
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D5E5FE] to-[#E7E5F3] text-slate-800 shadow-xl isolate">
        <div class="relative z-10 px-8 py-10 sm:px-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div class="max-w-xl">
            <h1 class="font-display text-3xl sm:text-4xl font-bold mb-3 tracking-tight text-slate-900">
              Selamat Datang, Admin{" "}
            </h1>
            <p class="text-slate-600 text-lg leading-relaxed max-w-lg">
              Kelola data buku, peminjaman, dan anggota perpustakaan SMPN 3
              Lumajang dengan mudah dan efisien.
            </p>
          </div>

          <div class="hidden sm:block">
            <div class="w-20 h-20 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/40 shadow-xl">
              <Library class="w-10 h-10 text-[#f48f65]" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={BookOpen}
          label="Total Koleksi Buku"
          value={stats.totalBooks}
          color="blue"
        />
        <StatCard
          icon={BookCheck}
          label="Buku Tersedia"
          value={stats.availableBooks}
          color="green"
        />
        <StatCard
          icon={Users}
          label="Jumlah Siswa"
          value={stats.totalBorrowers}
          color="purple"
        />
        <StatCard
          icon={BookOpen}
          label="Sedang Dipinjam"
          value={stats.borrowedBooks}
          color="orange"
        />
        <StatCard
          icon={BookCheck}
          label="Peminjaman Aktif"
          value={stats.activeLoansCount}
          color="teal"
        />
        <StatCard
          icon={AlertTriangle}
          label="Terlambat Kembali"
          value={stats.overdueCount}
          color="red"
        />
      </div>

      {/* Charts & Tables */}
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        <div class="xl:col-span-2 min-h-[400px]">
          <RecentLoansTable />
        </div>
        <div class="min-h-[400px]">
          <PopularBooks />
        </div>
      </div>
    </div>
  );
}
