import { useState, useEffect } from "preact/hooks";
import {
  X,
  Save,
  Loader2,
  AlertCircle,
  Trash2,
  AlertTriangle,
} from "lucide-preact";
import { updateBook, deleteBook } from "../../../stores/libraryStore";

export default function ModalsEdit({ isOpen, onClose, book }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahun_terbit: "",
    isbn: "",
    stok_total: 0,
    stok_tersedia: 0,
  });

  // Initialize form when book changes
  useEffect(() => {
    if (book) {
      setFormData({
        judul: book.judul || "",
        penulis: book.penulis || "",
        penerbit: book.penerbit || "",
        tahun_terbit: book.tahun_terbit || "",
        isbn: book.isbn || "",
        stok_total: book.stok_total || 0,
        stok_tersedia: book.stok_tersedia || 0,
      });
      setError(null);
      setShowConfirmDelete(false);
    }
  }, [book, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.startsWith("stok") ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Logic to ensure available stock isn't > total stock
      if (formData.stok_tersedia > formData.stok_total) {
        throw new Error("Stok tersedia tidak boleh melebihi stok total");
      }

      await updateBook(book.kode_buku, formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteBook(book.kode_buku);
      onClose();
    } catch (err) {
      setError("Gagal menghapus buku: " + err.message);
      setLoading(false);
      setShowConfirmDelete(false);
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-nerissa-onyx/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg bg-nerissa-midnight border border-white/10 rounded-nerissa-lg shadow-2xl overflow-hidden animate-slide-up">
        {/* Delete Confirmation Overlay */}
        {showConfirmDelete && (
          <div className="absolute inset-0 z-50 bg-nerissa-midnight/95 flex items-center justify-center p-6 animate-fade-in">
            <div className="text-center space-y-4 max-w-xs">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-display font-black text-white">
                Konfirmasi Hapus
              </h3>
              <p className="text-sm text-gray-400">
                Apakah Anda yakin ingin menghapus buku{" "}
                <strong>"{book.judul}"</strong>? Tindakan ini tidak dapat
                dibatalkan.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="btn btn-ghost flex-1 text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="btn bg-red-500 hover:bg-red-600 text-white flex-1 text-xs border-none"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-display font-black text-white tracking-tight uppercase">
            Edit Data Buku
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              title="Hapus Buku"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-nerissa text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="label">Judul Buku</label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onInput={handleChange}
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onInput={handleChange}
                  className="input font-mono"
                  placeholder="ISBN-13"
                />
              </div>
              <div>
                <label className="label">Penulis</label>
                <input
                  type="text"
                  name="penulis"
                  value={formData.penulis}
                  onInput={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Penerbit</label>
                <input
                  type="text"
                  name="penerbit"
                  value={formData.penerbit}
                  onInput={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Tahun</label>
                <input
                  type="text"
                  name="tahun_terbit"
                  value={formData.tahun_terbit}
                  onInput={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Total Stok</label>
                <input
                  type="number"
                  name="stok_total"
                  min="0"
                  value={formData.stok_total}
                  onInput={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Tersedia</label>
                <input
                  type="number"
                  name="stok_tersedia"
                  min="0"
                  max={formData.stok_total}
                  value={formData.stok_tersedia}
                  onInput={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-[2]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
