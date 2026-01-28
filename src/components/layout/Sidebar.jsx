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
    <aside class="h-full w-full bg-white border-r border-gray-200 text-gray-800 shadow-sm flex flex-col transition-all duration-300 relative overflow-hidden">
      {/* Header */}
      <div
        class={`p-4 border-b border-gray-100 flex items-center ${isCollapsed ? "justify-center" : "gap-3"} transition-all duration-300`}
      >
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 relative z-10 transition-all duration-300 hover:scale-105">
          <Library class="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div class="animate-fade-in overflow-hidden whitespace-nowrap">
            <h1 class="font-display font-bold text-lg leading-tight tracking-tight text-gray-900">
              Perpustakaan
            </h1>
            <p class="text-xs text-gray-500 font-medium">SMPN 3 Lumajang</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {!isCollapsed && (
          <p class="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-3 mb-2 mt-2 animate-fade-in">
            Menu Utama
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
              class={`group relative flex items-center w-full p-3 rounded-xl transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }
                ${isCollapsed ? "justify-center" : "gap-3"}
              `}
            >
              <Icon
                class={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"} ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
              />

              {!isCollapsed && (
                <span class="text-sm truncate animate-fade-in">
                  {item.label}
                </span>
              )}

              {isActive && !isCollapsed && (
                <ChevronRight class="w-4 h-4 ml-auto opacity-50" />
              )}

              {isCollapsed && isActive && (
                <div class="absolute right-1 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div class="p-4 border-t border-gray-100">
        <div
          class={`bg-gray-50 rounded-xl p-3 border border-gray-100 transition-all duration-300 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          <div
            class={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
          >
            <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-200">
              <GraduationCap class="w-4 h-4 text-blue-600" />
            </div>
            {!isCollapsed && (
              <div class="overflow-hidden whitespace-nowrap animate-fade-in">
                <p class="font-semibold text-sm text-gray-900">Petugas</p>
                <p class="text-[10px] text-gray-500">Admin Perpustakaan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
