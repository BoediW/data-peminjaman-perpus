import { useState } from "preact/hooks";
import {
  Search,
  Filter,
  BookOpen,
  Building2,
  Tag,
  Eye,
  Hash,
  Calendar,
  User,
  Zap,
  Activity,
  Sparkles
} from "lucide-preact";
import {
  filteredBooks,
  searchQuery,
  selectedCategory,
  categories,
  activeTab,
} from "../../stores/libraryStore";

function BookCard({ book, index }) {
  const available = book.stok_tersedia || 0;
  const total = book.stok_total || 0;
  const percentage = total > 0 ? (available / total) * 100 : 0;

  return (
    <div
      className="group card overflow-hidden flex flex-col h-full animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-zedd-glass to-white overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <BookOpen className="w-20 h-20 text-zedd-violet/10 group-hover:scale-110 group-hover:text-zedd-violet/20 transition-all duration-700" />
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <span className="badge badge-info shadow-sm">
            {book.kategori_nama || "Umum"}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-zedd-steel uppercase tracking-widest leading-none">Stok</span>
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${available > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {available}/{total}
              </span>
            </div>
            <div className="h-1.5 w-full bg-zedd-silver/30 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out rounded-full ${percentage > 50 ? "bg-emerald-500" : percentage > 20 ? "bg-amber-500" : "bg-red-500"
                  }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display font-black text-lg text-zedd-carbon group-hover:text-zedd-violet transition-colors line-clamp-2 leading-tight tracking-tight">
            {book.judul}
          </h3>
        </div>

        <div className="space-y-3 flex-1 mb-6">
          <div className="flex items-center gap-3 text-xs text-zedd-steel font-medium">
            <User className="w-4 h-4 text-zedd-violet/50" />
            <span className="truncate">{book.penulis || "Penulis tidak diketahui"}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zedd-steel font-medium">
            <Building2 className="w-4 h-4 text-zedd-violet/50" />
            <span className="truncate">{book.penerbit || "Penerbit tidak diketahui"}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zedd-steel font-medium">
            <Tag className="w-4 h-4 text-zedd-violet/50" />
            <span className="truncate font-mono">{book.kode_buku || "-"}</span>
          </div>
        </div>

        <button
          className="btn btn-outline w-full group/btn overflow-hidden relative h-11"
          onClick={() => { }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-zedd-violet to-zedd-blue -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
          <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest group-hover/btn:text-white">
            <Eye className="w-4 h-4" /> Lihat Detail
          </span>
        </button>
      </div>
    </div>
  );
}

export default function BookCatalog() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-zedd-violet/30"></div>
            <span className="text-[10px] font-black text-zedd-violet uppercase tracking-[0.4em] leading-none">Koleksi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-zedd-carbon tracking-tighter">
            Katalog Buku
          </h1>
          <p className="text-zedd-steel text-sm mt-3 font-medium tracking-tight">Jelajahi seluruh koleksi buku perpustakaan.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zedd-steel group-focus-within:text-zedd-violet transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Cari judul, penulis..."
              value={searchQuery.value}
              onInput={(e) => (searchQuery.value = e.target.value)}
              className="input pl-12 pr-6 h-14 w-full sm:w-[320px] text-sm font-bold tracking-tight rounded-full"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn h-14 px-8 rounded-full border-2 transition-all duration-300 font-black tracking-widest uppercase text-xs flex items-center gap-3
              ${showFilters ? 'bg-zedd-violet text-white border-zedd-violet' : 'bg-white text-zedd-steel border-zedd-silver hover:border-zedd-violet/30 hover:text-zedd-violet'}
            `}
          >
            <Filter className={`w-4 h-4 ${showFilters ? 'animate-bounce' : ''}`} /> Filter
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="card p-8 animate-slide-up border-zedd-violet/20 bg-zedd-violet/[0.02] relative overflow-hidden">
          <p className="label mb-6 flex items-center gap-3">
            <Sparkles size={14} /> Kategori Buku
          </p>
          <div className="flex flex-wrap gap-3 relative z-10">
            <button
              onClick={() => (selectedCategory.value = "all")}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2
                ${selectedCategory.value === "all"
                  ? "bg-zedd-violet border-zedd-violet text-white shadow-zedd"
                  : "bg-white text-zedd-steel border-zedd-silver/60 hover:border-zedd-violet/30 hover:text-zedd-violet"
                }
              `}
            >
              Semua
            </button>
            {categories.value.filter(c => c !== "all").map((cat) => (
              <button
                key={cat}
                onClick={() => (selectedCategory.value = cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2
                  ${selectedCategory.value === cat
                    ? "bg-zedd-violet border-zedd-violet text-white shadow-zedd"
                    : "bg-white text-zedd-steel border-zedd-silver/60 hover:border-zedd-violet/30 hover:text-zedd-violet"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredBooks.value.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredBooks.value.map((book, index) => (
            <BookCard key={book.kode_buku} book={book} index={index} />
          ))}
        </div>
      ) : (
        <div className="card py-32 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-zedd-glass rounded-full flex items-center justify-center mb-6 border border-zedd-silver/60">
            <Activity className="w-12 h-12 text-zedd-steel/30" />
          </div>
          <h3 className="text-xl font-display font-black text-zedd-steel uppercase tracking-[0.3em]">Tidak Ditemukan</h3>
          <p className="text-zedd-steel/60 mt-2 font-medium">Coba gunakan kata kunci pencarian yang berbeda.</p>
        </div>
      )}
    </div>
  );
}
