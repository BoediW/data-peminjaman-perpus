import { useState, useEffect, useRef, useCallback } from "preact/hooks";
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
  Zap,
  Sparkles,
  Activity,
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
    violet: "from-zedd-violet/8 to-zedd-violet/3 text-zedd-violet border-zedd-violet/15",
    green: "from-emerald-500/8 to-emerald-500/3 text-emerald-600 border-emerald-200",
    amber: "from-amber-500/8 to-amber-500/3 text-amber-600 border-amber-200",
    red: "from-red-500/8 to-red-500/3 text-red-500 border-red-200",
    blue: "from-zedd-blue/8 to-zedd-blue/3 text-zedd-blue border-zedd-blue/15",
    cyan: "from-zedd-cyan/8 to-zedd-cyan/3 text-zedd-cyan border-zedd-cyan/15",
  };

  return (
    <div className={`group relative bg-gradient-to-br ${colorClasses[color]} backdrop-blur-md rounded-zedd-lg p-7 border transition-all duration-500 hover:shadow-lg hover:-translate-y-1 overflow-hidden`}>
      {/* Spectrum Line Top */}
      <div className="absolute top-0 left-0 w-full h-0.5 spectrum-bar opacity-40"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-zedd bg-white/80 flex items-center justify-center border border-current/10 shadow-sm transition-transform group-hover:rotate-12">
            <Icon className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 leading-none">{label}</p>
        </div>

        <div className="flex items-baseline gap-3">
          <h3 className="text-4xl font-display font-black tracking-tight text-zedd-carbon">
            {value}
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Total</span>
        </div>

        {trend && (
          <div className="flex items-center gap-2 mt-5 text-[10px] font-black text-zedd-steel bg-white/60 w-fit px-3 py-1 rounded-full border border-current/10">
            <TrendingUp className="w-3 h-3" />
            <span className="uppercase tracking-[0.1em]">{trend}</span>
          </div>
        )}
      </div>

      {/* Background Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.04] rotate-[-15deg] group-hover:scale-125 transition-transform duration-700 pointer-events-none">
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
    <div className="card h-full flex flex-col overflow-hidden">
      <div className="p-8 border-b border-zedd-silver/40 flex items-center justify-between bg-zedd-glass/50">
        <h3 className="font-display font-black text-xl text-zedd-carbon flex items-center gap-4 tracking-tight">
          <Clock className="w-6 h-6 text-zedd-violet" />
          Peminjaman Terbaru
        </h3>
        <button
          onClick={() => (activeTab.value = "loans")}
          className="btn btn-ghost btn-sm group text-[10px] font-black tracking-widest uppercase hover:text-zedd-violet"
        >
          Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="overflow-x-auto flex-1 p-2 relative">
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
                    <div className="w-9 h-9 border border-zedd-violet/15 bg-zedd-violet/5 flex items-center justify-center font-bold text-xs text-zedd-violet rounded-zedd">
                      {loan.borrower?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-zedd-carbon text-sm tracking-tight capitalize">
                        {loan.borrower?.name}
                      </p>
                      <p className="text-[10px] font-bold text-zedd-steel uppercase tracking-widest mt-0.5">
                        Kelas {loan.borrower?.class}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zedd-carbon line-clamp-1 group-hover:text-zedd-violet transition-colors">
                      {loan.book?.title}
                    </span>
                    <span className="text-[10px] font-bold text-zedd-steel uppercase tracking-widest mt-1">
                      {formatDate(loan.borrowDate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`badge ${loan.status === "overdue" ? "badge-danger" : "badge-success"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${loan.status === "overdue" ? "bg-red-500 animate-ping" : "bg-emerald-500"}`}></div>
                    {loan.status === "overdue" ? "Terlambat" : "Dipinjam"}
                  </span>
                </td>
              </tr>
            ))}

            {recentLoans.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-zedd-steel/30">
                    <Activity className="w-16 h-16" />
                    <p className="text-xs font-black uppercase tracking-[0.4em]">Belum Ada Data</p>
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
    <div className="card h-full flex flex-col overflow-hidden">
      <div className="p-8 border-b border-zedd-silver/40 bg-zedd-glass/50">
        <h3 className="font-display font-black text-xl text-zedd-carbon flex items-center gap-4 tracking-tight">
          <TrendingUp className="w-6 h-6 text-zedd-blue" />
          Buku Populer
        </h3>
      </div>
      <div className="p-4 space-y-3 flex-1 relative">
        {popularBooks.map((book, index) => {
          const borrowed = (book.stok_total || 0) - (book.stok_tersedia || 0);
          return (
            <div
              key={book.kode_buku}
              className="flex items-center gap-5 p-4 bg-zedd-glass/50 border border-transparent hover:border-zedd-violet/20 rounded-zedd transition-all duration-300 group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-zedd flex items-center justify-center font-black text-sm shadow-sm shrink-0 transition-transform group-hover:rotate-12
              ${index === 0
                    ? "bg-gradient-to-tr from-amber-400 to-amber-500 text-white"
                    : index === 1
                      ? "bg-gradient-to-tr from-slate-300 to-slate-400 text-white"
                      : index === 2
                        ? "bg-gradient-to-tr from-orange-300 to-orange-400 text-white"
                        : "bg-zedd-glass text-zedd-steel border border-zedd-silver/60"
                  }`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-zedd-carbon truncate group-hover:text-zedd-violet transition-colors">
                  {book.judul}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-bold text-zedd-steel uppercase tracking-widest mt-1">
                  <span className="truncate max-w-[100px]">
                    {book.penerbit || "-"}
                  </span>
                  <div className="w-1 h-1 bg-zedd-violet/30 rounded-full"></div>
                  <span className="text-zedd-violet/60">
                    {borrowed} Dipinjam
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {popularBooks.length === 0 && (
          <div className="text-center py-20 text-zedd-steel font-black uppercase tracking-[0.4em] text-xs">
            Belum Ada Data
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Zedd x Valorant Spectrum Inspect Easter Egg
// YouTube IFrame Player API — plays actual music
// ==========================================
function useSpectrumInspect() {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const apiLoadedRef = useRef(false);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (apiLoadedRef.current) return;
    apiLoadedRef.current = true;

    // Create hidden container for the player
    const container = document.createElement("div");
    container.id = "yt-spectrum-player";
    container.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(container);
    containerRef.current = container;

    // Load the YT API script
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player("yt-spectrum-player", {
        height: "1",
        width: "1",
        videoId: "5tr191ap2vs",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (event) => {
            // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
            if (event.data === 0) {
              // Video ended
              setIsPlaying(false);
            } else if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
      }
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
    };
  }, []);

  const playSpectrumInspect = useCallback(() => {
    if (!playerRef.current || !isReady) return;

    try {
      const state = playerRef.current.getPlayerState();
      if (state === 1) {
        // Currently playing → pause
        playerRef.current.pauseVideo();
      } else {
        // Not playing → play from start
        playerRef.current.seekTo(0, true);
        playerRef.current.playVideo();
      }
    } catch (e) {
      console.warn("YouTube player error:", e);
    }
  }, [isReady]);

  return { playSpectrumInspect, isPlaying };
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { playSpectrumInspect, isPlaying: isEasterEggPlaying } = useSpectrumInspect();
  const stats = dashboardStats.value;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");

    if (!token || !adminUser) {
      window.location.href = "/";
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-zedd-violet animate-spin mx-auto mb-6" />
          <p className="text-zedd-steel font-display font-medium uppercase tracking-[0.3em] animate-pulse">Memverifikasi Sesi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-zedd-lg bg-white border border-zedd-silver/40 shadow-sm p-1">
        {/* Spectrum Accent */}
        <div className="absolute top-0 left-0 w-full h-1 spectrum-bar"></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-zedd-violet/[0.03] to-transparent"></div>

        <div className="relative z-10 px-10 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="h-px w-10 bg-zedd-violet/30"></div>
              <span className="text-[10px] font-black text-zedd-violet uppercase tracking-[0.4em] leading-none">Status: Active</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black mb-4 tracking-tighter text-zedd-carbon">
              Selamat Datang, <span className="text-spectrum">Admin</span>
            </h1>
            <p className="text-zedd-steel text-lg leading-relaxed max-w-lg font-medium tracking-tight">
              Kelola data buku, peminjaman, dan anggota perpustakaan <span className="text-zedd-violet font-bold">SMPN 3 Lumajang</span> dengan efisien.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-10">
              <div className="flex items-center gap-3 bg-zedd-glass border border-zedd-silver/60 px-6 py-2 rounded-full group">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-zedd-steel uppercase tracking-widest">System: Online</span>
              </div>
              <div className="flex items-center gap-3 bg-zedd-glass border border-zedd-silver/60 px-6 py-2 rounded-full group">
                <Sparkles className="w-4 h-4 text-zedd-violet" />
                <span className="text-xs font-bold text-zedd-steel uppercase tracking-widest">Sync: 100%</span>
              </div>
            </div>
          </div>

          <div className="relative group/avatar">
            <div className={`absolute -inset-10 rounded-full blur-[80px] transition-all duration-700 ${isEasterEggPlaying ? 'opacity-100 bg-zedd-violet/15' : 'opacity-0 bg-zedd-violet/5 group-hover/avatar:opacity-100'}`}></div>
            <button
              onClick={playSpectrumInspect}
              title="✨ Easter Egg"
              className={`w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center border-2 shadow-card relative overflow-hidden transition-all duration-700 cursor-pointer focus:outline-none
                ${isEasterEggPlaying
                  ? 'bg-gradient-to-tr from-zedd-violet/15 to-zedd-blue/15 border-zedd-violet/40 scale-105 shadow-zedd-lg'
                  : 'bg-gradient-to-tr from-zedd-violet/5 to-zedd-blue/5 border-zedd-silver/40 group-hover/avatar:scale-105'
                }`}
            >
              <Zap className={`w-20 h-20 transition-all duration-500 ${isEasterEggPlaying ? 'text-zedd-violet scale-110 animate-pulse' : 'text-zedd-violet/20 group-hover/avatar:scale-125 group-hover/avatar:text-zedd-violet/40'}`} />

              {/* Spectrum Ring Animation (visible when playing) */}
              {isEasterEggPlaying && (
                <>
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'conic-gradient(from 0deg, #8B5CF6, #3B82F6, #06B6D4, #EC4899, #8B5CF6)',
                    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #fff calc(100% - 4px))',
                    mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #fff calc(100% - 4px))',
                    animation: 'spin 1.5s linear infinite',
                  }}></div>
                  <div className="absolute inset-3 rounded-full" style={{
                    background: 'conic-gradient(from 180deg, #EC4899, #8B5CF6, #3B82F6, #06B6D4, #EC4899)',
                    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px))',
                    mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px))',
                    animation: 'spin 2s linear infinite reverse',
                    opacity: 0.6,
                  }}></div>
                  {/* Floating spectrum particles */}
                  <div className="absolute w-2 h-2 bg-zedd-violet rounded-full animate-ping" style={{ top: '20%', left: '15%' }}></div>
                  <div className="absolute w-1.5 h-1.5 bg-zedd-blue rounded-full animate-ping" style={{ top: '70%', right: '20%', animationDelay: '0.3s' }}></div>
                  <div className="absolute w-2 h-2 bg-zedd-cyan rounded-full animate-ping" style={{ bottom: '15%', left: '40%', animationDelay: '0.6s' }}></div>
                  <div className="absolute w-1.5 h-1.5 bg-zedd-pink rounded-full animate-ping" style={{ top: '30%', right: '10%', animationDelay: '0.9s' }}></div>
                </>
              )}

              {/* Idle pulse ring */}
              {!isEasterEggPlaying && (
                <div className="absolute inset-0 border-[10px] border-zedd-violet/5 rounded-full animate-ping opacity-0 group-hover/avatar:opacity-100"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          icon={BookOpen}
          label="Total Koleksi Buku"
          value={stats.totalBooks}
          color="violet"
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
          color="blue"
          trend="85% aktif membaca"
        />
        <StatCard
          icon={Library}
          label="Sedang Dipinjam"
          value={stats.borrowedBooks}
          color="amber"
        />
        <StatCard
          icon={Zap}
          label="Peminjaman Aktif"
          value={stats.activeLoansCount}
          color="cyan"
          trend="Aktif"
        />
        <StatCard
          icon={AlertTriangle}
          label="Terlambat Kembali"
          value={stats.overdueCount}
          color="red"
          trend="Perlu perhatian"
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
