import {
  X,
  Edit,
  Calendar,
  User,
  Building2,
  Tag,
  BookOpen,
  Layers,
} from "lucide-preact";

export default function ModalsInfo({ isOpen, onClose, book, onEdit }) {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-nerissa-onyx/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-nerissa-midnight border border-white/10 rounded-nerissa-lg shadow-2xl overflow-hidden animate-slide-up">
        {/* Header with Cover Art vibe */}
        <div className="relative h-48 bg-gradient-to-r from-nerissa-raven to-nerissa-onyx overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none sound-wave"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-nerissa-midnight to-transparent">
            <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight leading-none mb-2">
              {book.judul}
            </h2>
            <div className="flex items-center gap-2 text-nerissa-teal font-medium">
              <span className="bg-nerissa-teal/10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-nerissa-teal/20">
                {book.kategori_nama || "Umum"}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-sm font-mono text-gray-400">
                {book.kode_buku}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                Informasi Utama
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-nerissa bg-white/5 flex items-center justify-center text-nerissa-teal group-hover:bg-nerissa-teal group-hover:text-nerissa-onyx transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Penulis
                    </p>
                    <p className="text-white font-bold">
                      {book.penulis || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-nerissa bg-white/5 flex items-center justify-center text-nerissa-purple group-hover:bg-nerissa-purple group-hover:text-nerissa-onyx transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Penerbit
                    </p>
                    <p className="text-white font-bold">
                      {book.penerbit || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-nerissa bg-white/5 flex items-center justify-center text-nerissa-gold group-hover:bg-nerissa-gold group-hover:text-nerissa-onyx transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Tahun Terbit
                    </p>
                    <p className="text-white font-bold">
                      {book.tahun_terbit || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                Status Resource
              </label>
              <div className="p-4 rounded-nerissa bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Stok</span>
                  <span className="text-white font-bold font-mono">
                    {book.stok_total} Unit
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tersedia</span>
                  <span
                    className={`font-bold font-mono ${book.stok_tersedia > 0 ? "text-nerissa-teal" : "text-red-400"}`}
                  >
                    {book.stok_tersedia} Unit
                  </span>
                </div>
                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-nerissa-teal"
                    style={{
                      width: `${(book.stok_tersedia / book.stok_total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                Detail Lainnya
              </label>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Tag className="w-4 h-4" />
                <span>
                  ISBN:{" "}
                  <span className="text-white font-mono ml-2">
                    {book.isbn || "N/A"}
                  </span>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button onClick={onEdit} className="w-full btn btn-primary group">
                <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Edit Data Buku
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
