import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  BookPlus,
  UserPlus,
  RotateCcw,
  Library,
  GraduationCap,
  ChevronRight,
  Music,
  Mic2,
  Disc
} from "lucide-preact";
import { activeTab } from "../../stores/libraryStore";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "catalog", label: "Katalog Buku", icon: BookOpen },
  { id: "add-book", label: "Tambah Buku", icon: BookPlus },
  { id: "borrowers", label: "Data Peminjam", icon: Users },
  { id: "add-borrower", label: "Tambah Peminjam", icon: UserPlus },
  { id: "loans", label: "Peminjaman", icon: ClipboardList },
  { id: "return", label: "Pengembalian", icon: RotateCcw },
];

export default function Sidebar({ isCollapsed }) {
  const handleTabChange = (tabId) => {
    activeTab.value = tabId;
  };

  return (
    <aside className="h-full w-full bg-nerissa-midnight border-r border-white/5 text-gray-300 shadow-2xl flex flex-col transition-all duration-300 relative overflow-hidden">
      {/* Decorative Sound Texture */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.03] pointer-events-none sound-wave"></div>

      {/* Header */}
      <div
        className={`p-6 border-b border-white/5 flex items-center ${isCollapsed ? "justify-center" : "gap-4"} transition-all duration-300 relative z-10`}
      >
        <div className="w-12 h-12 bg-gradient-to-tr from-nerissa-teal to-nerissa-purple rounded-nerissa flex items-center justify-center shadow-lg shadow-nerissa-teal/20 shrink-0 transition-transform hover:rotate-12">
          <Library className="w-6 h-6 text-nerissa-onyx" />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in overflow-hidden whitespace-nowrap">
            <h1 className="font-display font-black text-xl leading-none tracking-tight text-white mb-1">
              Perpustakaan
            </h1>
            <p className="text-[10px] text-nerissa-teal font-bold uppercase tracking-[0.2em] opacity-80">SMPN 3 Lumajang</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
        {!isCollapsed && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black px-4 mb-4 mt-2 animate-fade-in flex items-center gap-2">
            <Music className="w-3 h-3" /> Menu Utama
          </p>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab.value === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              title={isCollapsed ? item.label : ""}
              className={`group relative flex items-center w-full px-5 py-3.5 rounded-nerissa transition-all duration-300 cursor-pointer overflow-hidden
                ${isActive
                  ? "bg-nerissa-teal/10 text-white"
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                }
                ${isCollapsed ? "justify-center" : "gap-4"}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-nerissa-teal"></div>
              )}

              <Icon
                className={`w-5 h-5 relative z-10 transition-all duration-300 ${isActive ? "scale-110 text-nerissa-teal shadow-nerissa" : "group-hover:scale-110 group-hover:text-nerissa-teal"}`}
              />

              {!isCollapsed && (
                <span className={`text-sm font-bold relative z-10 truncate animate-fade-in ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-200"}`}>
                  {item.label}
                </span>
              )}

              {isActive && !isCollapsed && (
                <div className="ml-auto opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 relative z-10">
        <div
          className={`bg-nerissa-onyx/50 rounded-nerissa-lg p-4 border border-white/5 transition-all duration-300 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-4"}`}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-full flex items-center justify-center shrink-0 shadow-inner group overflow-hidden">
              <div className="relative">
                <GraduationCap className="w-5 h-5 text-nerissa-teal" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap animate-fade-in">
                <p className="font-bold text-sm text-white tracking-tight">Petugas</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Admin Perpustakaan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
