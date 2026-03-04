import { useState, useEffect } from "preact/hooks";
import { Menu, User, LayoutDashboard, Wrench, LogOut, Bell, Search, Zap } from "lucide-preact";

export default function AdminNavbar({
  onToggleSidebar,
  onToggleMobileSidebar,
}) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("adminUser");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setUserName(parsed.nama);
      setUserEmail(parsed.email);
    } catch { }
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector("main");
    if (!mainContent) return;

    const handleScroll = () => {
      setIsScrolled(mainContent.scrollTop > 10);
    };

    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex items-center justify-between px-8 py-4 transition-all duration-500 sticky top-0 z-30 ${isScrolled
        ? "bg-white/70 backdrop-blur-2xl border-b border-zedd-silver/40 shadow-sm"
        : "bg-transparent border-b border-transparent py-6"
        }`}
    >
      <div className="flex items-center gap-6">
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              onToggleMobileSidebar?.();
            } else {
              onToggleSidebar?.();
            }
          }}
          className="group flex items-center justify-center w-11 h-11 bg-zedd-glass border border-zedd-silver/60 rounded-zedd hover:border-zedd-violet/30 transition-all duration-300 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-zedd-steel transition-transform group-hover:scale-110 group-hover:text-zedd-violet" />
        </button>

        <h2 className={`font-display font-black text-xl text-zedd-carbon transition-all duration-500 overflow-hidden whitespace-nowrap ${isScrolled ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className={`hidden lg:flex items-center bg-zedd-glass px-4 h-11 rounded-full border border-zedd-silver/60 focus-within:border-zedd-violet/40 transition-all ${isScrolled ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <Search className="w-4 h-4 text-zedd-steel" />
          <input type="text" placeholder="Cari data..." className="bg-transparent border-none outline-none text-xs text-zedd-carbon placeholder:text-zedd-steel/60 px-3 w-40" />
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex w-11 h-11 items-center justify-center bg-zedd-glass border border-zedd-silver/60 rounded-full text-zedd-steel hover:text-zedd-violet hover:border-zedd-violet/30 transition-all relative group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-zedd-violet rounded-full animate-ping"></span>
            <span className="absolute top-3 right-3 w-2 h-2 bg-zedd-violet rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              aria-label="User menu"
              className="flex items-center gap-4 pl-1 pr-1 py-1 rounded-full transition-all duration-300 focus:outline-none cursor-pointer group hover:bg-zedd-glass border border-transparent hover:border-zedd-silver/60"
            >
              <div className="text-right hidden md:block pl-4">
                <p className="text-sm font-bold text-zedd-carbon leading-none group-hover:text-zedd-violet transition-colors">
                  {userName || "Admin"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-zedd-steel font-bold mt-1">
                  Administrator
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-zedd-violet to-zedd-blue rounded-full flex items-center justify-center text-white shadow-zedd transition-all duration-300 group-hover:rotate-12 ring-2 ring-zedd-violet/10">
                <User className="w-6 h-6" />
              </div>
            </button>

            {/* Dropdown Menu */}
            <div
              id="profile-dropdown"
              className={`absolute right-0 mt-4 w-72 bg-white border border-zedd-silver/60 rounded-zedd-lg shadow-zedd-lg py-3 z-50 transform transition-all duration-500 origin-top-right ${isProfileDropdownOpen
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}
            >
              <div className="px-6 py-4 bg-zedd-glass border-b border-zedd-silver/40 mb-2 rounded-t-zedd-lg">
                <p className="text-[10px] font-black text-zedd-violet uppercase tracking-[0.2em] mb-1">
                  Sesi Aktif
                </p>
                <p className="text-sm font-black text-zedd-carbon truncate max-w-full">
                  {userName || "Admin"}
                </p>
                <p className="text-xs text-zedd-steel truncate mt-1">
                  {userEmail || "admin@sekolah.sch.id"}
                </p>
              </div>

              <div className="px-2 space-y-1">
                <a
                  href="/dashboard"
                  className="flex items-center px-4 py-2.5 text-sm text-zedd-steel hover:bg-zedd-violet/5 hover:text-zedd-violet rounded-zedd transition-all duration-300 gap-4 font-bold group"
                >
                  <div className="w-8 h-8 rounded-full bg-zedd-glass flex items-center justify-center group-hover:bg-zedd-violet/10 border border-zedd-silver/40">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  Dashboard
                </a>
                <a
                  href="/dashboard"
                  className="flex items-center px-4 py-2.5 text-sm text-zedd-steel hover:bg-zedd-violet/5 hover:text-zedd-violet rounded-zedd transition-all duration-300 gap-4 font-bold group"
                >
                  <div className="w-8 h-8 rounded-full bg-zedd-glass flex items-center justify-center group-hover:bg-zedd-violet/10 border border-zedd-silver/40">
                    <Wrench className="w-4 h-4" />
                  </div>
                  Pengaturan
                </a>
              </div>

              <div className="border-t border-zedd-silver/40 mt-3 pt-2 px-2">
                <button
                  onClick={() => {
                    localStorage.removeItem("adminUser");
                    localStorage.removeItem("adminToken");
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-zedd transition-all duration-300 gap-4 font-black group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 border border-red-200">
                    <LogOut className="w-4 h-4" />
                  </div>
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Overlay */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
}
