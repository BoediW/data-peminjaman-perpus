import { useState } from "preact/hooks";
import {
  Search,
  Filter,
  BookOpen,
  Building2,
  Tag,
  Eye,
  BookMarked,
  Hash,
  Calendar,
  User,
  Music,
  Disc,
  Sparkles,
} from "lucide-preact";
import {
  filteredBooks,
  searchQuery,
  selectedCategory,
  categories,
  activeTab,
} from "../../stores/libraryStore";
import ModalsInfo from "./catalog/ModalsInfo";
import ModalsEdit from "./catalog/ModalsEdit";

function BookCard({ book, index, onDetail }) {
  const available = book.stok_tersedia || 0;
  const total = book.stok_total || 0;
  const percentage = (available / total) * 100;

  return (
    <div
      className="group card overflow-hidden border-white/5 bg-nerissa-midnight/40 backdrop-blur-xl flex flex-col h-full animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-nerissa-raven to-nerissa-onyx overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none sound-wave"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-nerissa-onyx via-transparent to-transparent"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <BookOpen className="w-20 h-20 text-nerissa-teal/10 group-hover:scale-110 group-hover:text-nerissa-teal/20 transition-all duration-700" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Disc className="w-16 h-16 text-nerissa-teal animate-spin-slow" />
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <span className="badge badge-info shadow-nerissa">
            {book.kategori_nama || "Umum"}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          {/* Stock Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                Resource Balance
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-widest leading-none ${available > 0 ? "text-nerissa-teal" : "text-red-400"}`}
              >
                {available}/{total}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-1000 ease-out rounded-full shadow-nerissa ${
                  percentage > 50
                    ? "bg-nerissa-teal"
                    : percentage > 20
                      ? "bg-nerissa-gold"
                      : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display font-black text-lg text-white group-hover:text-nerissa-teal transition-colors line-clamp-2 leading-tight tracking-tight uppercase">
            {book.judul}
          </h3>
        </div>

        <div className="space-y-3 flex-1 mb-6">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <User className="w-4 h-4 text-nerissa-teal/60" />
            <span className="truncate italic">
              {book.penulis || "Unknown Artist"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <Building2 className="w-4 h-4 text-nerissa-teal/60" />
            <span className="truncate">
              {book.penerbit || "Universal Records"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <Tag className="w-4 h-4 text-nerissa-teal/60" />
            <span className="truncate">{book.isbn || "ISRC-NONE"}</span>
          </div>
        </div>

        <button
          className="btn btn-outline w-full group/btn overflow-hidden relative h-11"
          onClick={() => onDetail(book)}
        >
          <div className="absolute inset-0 bg-nerissa-teal -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
          <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest group-hover/btn:text-nerissa-onyx">
            <Eye className="w-4 h-4 animate-pulse" /> Detail Archivist
          </span>
        </button>
      </div>
    </div>
  );
}

export default function BookCatalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDetail = (book) => {
    setSelectedBook(book);
    setIsInfoOpen(true);
  };

  const handleEdit = () => {
    setIsInfoOpen(false);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-nerissa-teal/40"></div>
            <span className="text-[10px] font-black text-nerissa-teal uppercase tracking-[0.4em] leading-none">
              Registry
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase">
            Katalog Buku
          </h1>
          <p className="text-gray-500 text-sm mt-3 font-medium tracking-tight">
            Menjelajahi arsip pengetahuan dengan harmoni yang sempurna.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-nerissa-teal transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Cari judul, penulis..."
              value={searchQuery.value}
              onInput={(e) => (searchQuery.value = e.target.value)}
              className="input pl-12 pr-6 h-14 w-full sm:w-[320px] bg-nerissa-midnight/60 text-sm font-bold tracking-tight rounded-full"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn h-14 px-8 rounded-full border-2 transition-all duration-300 font-black tracking-widest uppercase text-xs flex items-center gap-3
              ${showFilters ? "bg-nerissa-teal text-nerissa-onyx border-nerissa-teal" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"}
            `}
          >
            <Filter
              className={`w-4 h-4 ${showFilters ? "animate-bounce" : ""}`}
            />{" "}
            Filter
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="card p-8 animate-slide-up border-nerissa-teal/20 bg-nerissa-teal/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Disc size={120} className="animate-spin-slow" />
          </div>
          <p className="label mb-6 flex items-center gap-3">
            <Music size={14} /> Kategorisasi Melodik
          </p>
          <div className="flex flex-wrap gap-3 relative z-10">
            <button
              onClick={() => (selectedCategory.value = null)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2
                ${
                  selectedCategory.value === null
                    ? "bg-nerissa-teal border-nerissa-teal text-nerissa-onyx shadow-nerissa"
                    : "bg-nerissa-onyx/50 text-gray-500 border-white/5 hover:border-white/20 hover:text-gray-300"
                }
              `}
            >
              Semua Genre
            </button>
            {categories.value.map((cat) => (
              <button
                key={cat}
                onClick={() => (selectedCategory.value = cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2
                  ${
                    selectedCategory.value === cat
                      ? "bg-nerissa-teal border-nerissa-teal text-nerissa-onyx shadow-nerissa"
                      : "bg-nerissa-onyx/50 text-gray-500 border-white/5 hover:border-white/20 hover:text-gray-300"
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
            <BookCard
              key={book.kode_buku}
              book={book}
              index={index}
              onDetail={handleDetail}
            />
          ))}
        </div>
      ) : (
        <div className="card py-32 flex flex-col items-center justify-center text-center bg-nerissa-midnight/20 border-white/5">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Disc className="w-12 h-12 text-gray-700 animate-spin-slow" />
          </div>
          <h3 className="text-xl font-display font-black text-gray-600 uppercase tracking-[0.3em]">
            Arsip Tidak Ditemukan
          </h3>
          <p className="text-gray-700 mt-2 font-medium">
            Coba gunakan frekuensi pencarian yang berbeda.
          </p>
        </div>
      )}
      <ModalsInfo
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        book={selectedBook}
        onEdit={handleEdit}
      />

      <ModalsEdit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        book={selectedBook}
      />
    </div>
  );
}
