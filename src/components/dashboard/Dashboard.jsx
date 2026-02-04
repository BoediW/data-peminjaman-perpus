import { useState, useEffect } from "preact/hooks";
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
  Loader2,
  Music,
  Mic2,
  Disc,
  Sparkles
} from "lucide-preact";
import {
  dashboardStats,
  activeLoans,
  books,
  borrowers,
  formatDate,
  getLoanDetails,
  activeTab,
} from "../../stores/libraryStore";

function StatCard({ icon: Icon, label, value, color, trend }) {
  const colorClasses = {
    blue: "from-nerissa-teal/10 to-nerissa-teal/5 text-nerissa-teal border-nerissa-teal/20 shadow-nerissa-teal/10",
    green: "from-emerald-500/10 to-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10",
    orange: "from-nerissa-gold/10 to-nerissa-gold/5 text-nerissa-gold border-nerissa-gold/20 shadow-nerissa-gold/10",
    red: "from-red-500/10 to-red-500/5 text-red-400 border-red-500/20 shadow-red-500/10",
    purple: "from-nerissa-purple/10 to-nerissa-purple/5 text-nerissa-purple border-nerissa-purple/20 shadow-nerissa-purple/10",
    teal: "from-cyan-400/10 to-cyan-400/5 text-cyan-400 border-cyan-400/20 shadow-cyan-400/10",
  };

  return (
    <div className={`group relative bg-gradient-to-br ${colorClasses[color]} backdrop-blur-md rounded-nerissa-lg p-7 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}>
      {/* Wave Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-nerissa bg-nerissa-onyx/40 flex items-center justify-center border border-white/5 shadow-inner transition-transform group-hover:rotate-12">
            <Icon className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 leading-none">{label}</p>
        </div>

        <div className="flex items-baseline gap-3">
          <h3 className="text-4xl font-display font-black tracking-tight text-white">
            {value}
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Total Units</span>
        </div>

        {trend && (
          <div className="flex items-center gap-2 mt-5 text-[10px] font-black text-white/40 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
            <TrendingUp className="w-3 h-3 text-nerissa-teal" />
            <span className="uppercase tracking-[0.1em]">{trend}</span>
          </div>
        )}
      </div>

      {/* Background Decorative Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-[-15deg] group-hover:scale-125 transition-transform duration-700 pointer-events-none">
        <Icon className="w-32 h-32" />
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
    <div className="card h-full flex flex-col border-white/5 shadow-2xl overflow-hidden bg-nerissa-midnight/40 backdrop-blur-xl">
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
        <h3 className="font-display font-black text-xl text-white flex items-center gap-4 tracking-tight">
          <Clock className="w-6 h-6 text-nerissa-teal animate-pulse" />
          Peminjaman Terbaru
        </h3>
        <button
          onClick={() => (activeTab.value = "loans")}
          className="btn btn-ghost btn-sm group text-[10px] font-black tracking-widest uppercase hover:text-nerissa-teal"
        >
          Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="overflow-x-auto flex-1 p-2 relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.02] pointer-events-none sound-wave"></div>
        <table className="table">
          <thead>
            <tr>
              <th>Peminjam</th>
              <th>Buku</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentLoans.map((loan) => (
              <tr key={loan.id} className="group transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 border border-white/10 bg-nerissa-onyx/40 flex items-center justify-center font-bold text-xs text-nerissa-teal rounded-nerissa">
                      {loan.borrower?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm tracking-tight capitalize">
                        {loan.borrower?.name}
                      </p>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-0.5">
                        Kelas {loan.borrower?.class}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-300 line-clamp-1 group-hover:text-nerissa-teal transition-colors">
                      {loan.book?.title}
                    </span>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">
                      {formatDate(loan.borrowDate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`badge ${loan.status === "overdue" ? "badge-danger" : "badge-success"
                      }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${loan.status === "overdue" ? "bg-red-500 animate-ping" : "bg-nerissa-teal shadow-nerissa"
                      }`}></div>
                    {loan.status === "overdue" ? "Terlambat" : "Dipinjam"}
                  </span>
                </td>
              </tr>
            ))}

            {recentLoans.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-10">
                    <Disc className="w-16 h-16 animate-spin-slow" />
                    <p className="text-xs font-black uppercase tracking-[0.4em]">Registry Empty</p>
                  </div>
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
  const popularBooks = [...books.value]
    .sort((a, b) => {
      const borrowedA = (a.stok_total || 0) - (a.stok_tersedia || 0);
      const borrowedB = (b.stok_total || 0) - (b.stok_tersedia || 0);
      return borrowedB - borrowedA;
    })
    .slice(0, 5);

  return (
    <div className="card h-full flex flex-col border-white/5 shadow-2xl overflow-hidden bg-nerissa-midnight/40 backdrop-blur-xl">
      <div className="p-8 border-b border-white/5 bg-nerissa-teal/5">
        <h3 className="font-display font-black text-xl text-white flex items-center gap-4 tracking-tight">
          <TrendingUp className="w-6 h-6 text-nerissa-gold" />
          Buku Populer
        </h3>
      </div>
      <div className="p-4 space-y-3 flex-1 relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.02] pointer-events-none sound-wave"></div>
        {popularBooks.map((book, index) => {
          const borrowed = (book.stok_total || 0) - (book.stok_tersedia || 0);
          return (
            <div
              key={book.kode_buku}
              className="flex items-center gap-5 p-4 bg-white/5 border border-transparent hover:border-nerissa-teal/30 rounded-nerissa transition-all duration-300 group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-nerissa flex items-center justify-center font-black text-sm shadow-xl shrink-0 transition-transform group-hover:rotate-12
              ${index === 0
                    ? "bg-gradient-to-tr from-nerissa-gold to-yellow-600 text-nerissa-onyx"
                    : index === 1
                      ? "bg-gradient-to-tr from-slate-300 to-slate-500 text-nerissa-onyx"
                      : index === 2
                        ? "bg-gradient-to-tr from-orange-400 to-orange-600 text-nerissa-onyx"
                        : "bg-nerissa-onyx text-gray-500 border border-white/5"
                  }`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white truncate group-hover:text-nerissa-teal transition-colors">
                  {book.judul}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">
                  <span className="truncate max-w-[100px] italic">
                    {book.penerbit || "-"}
                  </span>
                  <div className="w-1 h-1 bg-nerissa-teal/30 rounded-full"></div>
                  <span className="text-nerissa-teal/60">
                    {borrowed} Dipinjam
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {popularBooks.length === 0 && (
          <div className="text-center py-20 text-gray-700 font-black uppercase tracking-[0.4em]">
            No Records
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const stats = dashboardStats.value;

  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");

    if (!token || !adminUser) {
      // Jika belum login, redirect ke halaman login
      window.location.href = "/";
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  // Tampilkan loading saat mengecek autentikasi
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nerissa-onyx">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-nerissa-teal animate-spin mx-auto mb-6" />
          <p className="text-gray-400 font-display font-medium uppercase tracking-[0.3em] animate-pulse">Memverifikasi Sesi...</p>
        </div>
      </div>
    );
  }

  // Jika tidak terautentikasi, jangan render apapun (sudah redirect)
  if (!isAuthenticated) return null;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-nerissa-lg bg-gradient-to-br from-nerissa-midnight to-nerissa-onyx border border-white/10 shadow-nerissa-lg p-1">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-nerissa-teal/5 to-transparent"></div>
        <div className="absolute -bottom-10 -right-10 text-[18rem] text-white/5 font-display select-none pointer-events-none">N</div>

        <div className="relative z-10 px-10 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="h-px w-10 bg-nerissa-teal/40"></div>
              <span className="text-[10px] font-black text-nerissa-teal uppercase tracking-[0.4em] leading-none">Status: Melodic</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black mb-4 tracking-tighter text-white uppercase italic">
              Selamat Datang, Admin
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg font-medium tracking-tight">
              Kelola data buku, peminjaman, dan anggota perpustakaan <span className="text-nerissa-teal">SMPN 3 Lumajang</span> dengan melodi efisiensi.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-10">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full shadow-inner group">
                <div className="w-2 h-2 bg-nerissa-teal rounded-full animate-pulse shadow-nerissa"></div>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Resonance: Optimal</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full shadow-inner group">
                <Sparkles className="w-4 h-4 text-nerissa-gold" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Sync: 100%</span>
              </div>
            </div>
          </div>

          <div className="relative group/avatar">
            <div className="absolute -inset-10 bg-nerissa-teal/10 rounded-full blur-[80px] opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
            <div className="w-40 h-40 md:w-56 md:h-56 bg-gradient-to-tr from-nerissa-midnight to-nerissa-onyx rounded-full flex items-center justify-center border-2 border-white/10 shadow-2xl relative overflow-hidden group-hover/avatar:scale-110 transition-transform duration-700">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30"></div>
              <div className="relative">
                <Mic2 className="w-20 h-20 text-nerissa-teal/40 group-hover/avatar:scale-125 group-hover/avatar:text-nerissa-teal transition-all duration-700" />
              </div>
              {/* Sound wave pulses around avatar */}
              <div className="absolute inset-0 border-[10px] border-nerissa-teal/10 rounded-full animate-ping opacity-0 group-hover/avatar:opacity-100"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          icon={BookOpen}
          label="Total Koleksi Buku"
          value={stats.totalBooks}
          color="blue"
          trend="+12 unit bulan ini"
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
          trend="85% aktif membaca"
        />
        <StatCard
          icon={Library}
          label="Sedang Dipinjam"
          value={stats.borrowedBooks}
          color="orange"
        />
        <StatCard
          icon={Music}
          label="Peminjaman Aktif"
          value={stats.activeLoansCount}
          color="teal"
          trend="Melodi Linkage"
        />
        <StatCard
          icon={AlertTriangle}
          label="Terlambat Kembali"
          value={stats.overdueCount}
          color="red"
          trend="Cek Registry"
        />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
        <div className="xl:col-span-2 min-h-[500px]">
          <RecentLoansTable />
        </div>
        <div className="min-h-[500px]">
          <PopularBooks />
        </div>
      </div>
    </div>
  );
}
