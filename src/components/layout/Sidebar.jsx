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
  Zap,
  Sparkles,
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
    <aside className="h-full w-full bg-white border-r border-zedd-silver/40 text-zedd-carbon shadow-sm flex flex-col transition-all duration-300 relative overflow-hidden">
      {/* Subtle Spectrum Bottom Decoration */}
      <div className="absolute inset-x-0 bottom-0 h-px spectrum-bar opacity-30"></div>

      {/* Header */}
      <div
        className={`p-6 border-b border-zedd-silver/40 flex items-center ${isCollapsed ? "justify-center" : "gap-4"} transition-all duration-300 relative z-10`}
      >
        <div className="w-12 h-12 bg-gradient-to-tr from-zedd-violet to-zedd-blue rounded-zedd flex items-center justify-center shadow-zedd shrink-0 transition-transform hover:rotate-12">
          <Library className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in overflow-hidden whitespace-nowrap">
            <h1 className="font-display font-black text-xl leading-none tracking-tight text-zedd-carbon mb-1">
              Perpustakaan
            </h1>
            <p className="text-[10px] text-zedd-violet font-bold uppercase tracking-[0.2em] opacity-80">SMPN 3 Lumajang</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin relative z-10">
        {!isCollapsed && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-zedd-steel font-black px-4 mb-4 mt-2 animate-fade-in flex items-center gap-2">
            <Zap className="w-3 h-3 text-zedd-violet" /> Menu Utama
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
              className={`group relative flex items-center w-full px-5 py-3.5 rounded-zedd transition-all duration-300 cursor-pointer overflow-hidden
                ${isActive
                  ? "bg-zedd-violet/8 text-zedd-violet"
                  : "text-zedd-steel hover:bg-zedd-glass hover:text-zedd-carbon"
                }
                ${isCollapsed ? "justify-center" : "gap-4"}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-zedd-violet to-zedd-blue rounded-r"></div>
              )}

              <Icon
                className={`w-5 h-5 relative z-10 transition-all duration-300 ${isActive ? "scale-110 text-zedd-violet" : "group-hover:scale-110 group-hover:text-zedd-violet"}`}
              />

              {!isCollapsed && (
                <span className={`text-sm font-bold relative z-10 truncate animate-fade-in ${isActive ? "text-zedd-violet" : "text-zedd-steel group-hover:text-zedd-carbon"}`}>
                  {item.label}
                </span>
              )}

              {isActive && !isCollapsed && (
                <div className="ml-auto opacity-40">
                  <ChevronRight className="w-4 h-4 text-zedd-violet" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zedd-silver/40 relative z-10">
        <div
          className={`bg-zedd-glass rounded-zedd-lg p-4 border border-zedd-silver/40 transition-all duration-300 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-4"}`}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-zedd-violet/10 to-zedd-blue/10 rounded-full flex items-center justify-center shrink-0 border border-zedd-violet/20">
              <GraduationCap className="w-5 h-5 text-zedd-violet" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap animate-fade-in">
                <p className="font-bold text-sm text-zedd-carbon tracking-tight">Petugas</p>
                <p className="text-[10px] text-zedd-steel font-medium uppercase tracking-widest">Admin Perpustakaan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
