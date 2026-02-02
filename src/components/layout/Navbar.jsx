import { useState, useEffect } from "preact/hooks";
import { Menu, User, LayoutDashboard, Wrench, LogOut } from "lucide-preact";

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
      className={`flex items-center justify-between px-6 py-4 transition-all duration-300 sticky top-0 z-30 ${
        isScrolled
          ? "glass-nav mx-4 mt-4 rounded-2xl border border-white/20 shadow-lg bg-white/80 backdrop-blur-xl"
          : "bg-transparent border-b border-transparent p-6"
      }`}
    >
      <div class="flex items-center gap-4">
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              onToggleMobileSidebar?.();
            } else {
              onToggleSidebar?.();
            }
          }}
          className={`group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer ${
            isScrolled
              ? "bg-white/50 border border-gray-200 hover:bg-white hover:shadow-md text-gray-600"
              : "bg-white border border-gray-200/50 shadow-sm hover:shadow hover:border-gray-300 text-gray-600"
          }`}
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>

        <h2
          class={`text-lg font-display font-bold text-gray-800 transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0 hidden sm:block"}`}
        >
          Dashboard
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={toggleProfileDropdown}
          aria-label="User menu"
          className={`flex items-center gap-3 pl-1 pr-1 py-1 rounded-full transition-all duration-200 focus:outline-none cursor-pointer group ${isScrolled ? "bg-gray-100/50 hover:bg-gray-100" : "bg-white/60 hover:bg-white border border-transparent hover:border-gray-100 shadow-sm"}`}
        >
          <div className="text-right hidden sm:block pl-3">
            <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-primary-600 transition-colors">
              {userName || "Admin"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              Administrator
            </p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-white group-hover:scale-105 transition-all duration-200">
            <User className="w-5 h-5" />
          </div>
        </button>

        {/* Dropdown Menu */}
        <div
          id="profile-dropdown"
          className={`absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transform transition-all duration-200 origin-top-right ${
            isProfileDropdownOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
          role="menu"
        >
          {/* User Info Mobile */}
          <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 mb-2 rounded-t-2xl">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">
              Signed in as
            </p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {userName || "Admin"}
            </p>
            <p className="text-xs text-gray-500 truncate font-mono mt-0.5">
              {userEmail || "admin@sekolah.sch.id"}
            </p>
          </div>

          <div className="px-2 space-y-1">
            <a
              href="/site/private/admin"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all duration-200 gap-3 font-medium group"
            >
              <div class="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600 flex items-center justify-center transition-colors">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              Dashboard
            </a>
            <a
              href="/site/private/admin/settings"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all duration-200 gap-3 font-medium group"
            >
              <div class="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600 flex items-center justify-center transition-colors">
                <Wrench className="w-4 h-4" />
              </div>
              Pengaturan Akun
            </a>
          </div>

          <div className="border-t border-gray-100 my-2 pt-2 px-2">
            <button
              onClick={() => {
                localStorage.removeItem("adminUser");
                window.location.href = "/site/private/admin/login";
              }}
              className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 gap-3 font-medium group"
            >
              <div class="w-8 h-8 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 group-hover:text-red-700 flex items-center justify-center transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
}
