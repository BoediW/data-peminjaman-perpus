import { useState, useEffect } from "preact/hooks";
import {
  Menu,
  User,
  LayoutDashboard,
  Wrench,
  LogOut,
  Bell,
  Search,
  Mic2,
  Music,
} from "lucide-preact";

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

      // fetch fresh user data
      (async () => {
        try {
          const token = localStorage.getItem("adminToken");
          if (!token) return;
          const resp = await fetch("/api/auth/admin/me", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!resp.ok) return;
          const json = await resp.json();
          const user = json?.user;
          if (user) {
            setUserName(user.nama);
            setUserEmail(user.email);
          }
        } catch {}
      })();
    } catch {}
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
      className={`flex items-center justify-between px-8 py-4 transition-all duration-500 sticky top-0 z-30 ${
        isScrolled
          ? "bg-nerissa-midnight/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl"
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
          className="group flex items-center justify-center w-11 h-11 bg-white/5 border border-white/10 rounded-nerissa hover:border-nerissa-teal transition-all duration-300 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-gray-400 transition-transform group-hover:scale-110 group-hover:text-nerissa-teal" />
        </button>

        <h2
          className={`font-display font-black text-xl text-white transition-all duration-500 overflow-hidden whitespace-nowrap ${isScrolled ? "w-auto opacity-100" : "w-0 opacity-0"}`}
        >
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar Decoration */}
        <div
          className={`hidden lg:flex items-center bg-white/5 px-4 h-11 rounded-full border border-white/10 focus-within:border-nerissa-teal/50 transition-all ${isScrolled ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
        >
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Cari data..."
            className="bg-transparent border-none outline-none text-xs text-gray-300 placeholder:text-gray-600 px-3 w-40"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex w-11 h-11 items-center justify-center bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-nerissa-teal hover:border-nerissa-teal transition-all relative group">
            <Bell className="w-5 h-5" />{" "}
          </button>

          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              aria-label="User menu"
              className="flex items-center gap-4 pl-1 pr-1 py-1 rounded-full transition-all duration-300 focus:outline-none cursor-pointer group hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <div className="text-right hidden md:block pl-4">
                <p className="text-sm font-bold text-white leading-none group-hover:text-nerissa-teal transition-colors">
                  {userName || "Admin"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">
                  Administrator
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-nerissa-teal to-nerissa-purple rounded-full flex items-center justify-center text-nerissa-onyx shadow-xl transition-all duration-300 group-hover:rotate-12 ring-2 ring-white/10">
                <User className="w-6 h-6" />
              </div>
            </button>

            {/* Dropdown Menu */}
            <div
              id="profile-dropdown"
              className={`absolute right-0 mt-4 w-72 bg-nerissa-midnight border border-white/10 rounded-nerissa-lg shadow-nerissa-lg py-3 z-50 transform transition-all duration-500 origin-top-right ${
                isProfileDropdownOpen
                  ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              <div className="px-6 py-4 bg-white/5 border-b border-white/10 mb-2 rounded-t-nerissa-lg">
                <p className="text-[10px] font-black text-nerissa-teal uppercase tracking-[0.2em] mb-1">
                  Sesi Aktif
                </p>
                <p className="text-sm font-black text-white truncate max-w-full">
                  {userName || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {userEmail || "admin@sekolah.sch.id"}
                </p>
              </div>

              <div className="px-2 space-y-1">
                <a
                  href="/site/private/admin"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-nerissa-teal rounded-nerissa transition-all duration-300 gap-4 font-bold uppercase tracking-widest group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-nerissa-teal/20">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  Dashboard
                </a>
                <a
                  href="/site/private/admin/settings"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-nerissa-teal rounded-nerissa transition-all duration-300 gap-4 font-bold uppercase tracking-widest group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-nerissa-teal/20">
                    <Wrench className="w-4 h-4" />
                  </div>
                  Pengaturan
                </a>
              </div>

              <div className="border-t border-white/5 mt-3 pt-2 px-2">
                <button
                  onClick={() => {
                    localStorage.removeItem("adminUser");
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-nerissa transition-all duration-300 gap-4 font-black uppercase tracking-widest group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20">
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
