import { useState, useEffect } from "preact/hooks";
import {
  X,
  Save,
  Loader2,
  AlertCircle,
  Trash2,
  AlertTriangle,
  User,
  GraduationCap,
} from "lucide-preact";
import { updateBorrower, deleteBorrower } from "../../../stores/libraryStore";

export default function EditBorrower({ isOpen, onClose, borrower }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({
    nama_siswa: "",
    nisn: "",
    kelas: "",
  });

  // Initialize form when borrower changes
  useEffect(() => {
    if (borrower) {
      setFormData({
        nama_siswa: borrower.nama_siswa || "",
        nisn: borrower.nisn || "",
        kelas: borrower.kelas || "",
      });
      setError(null);
      setShowConfirmDelete(false);
    }
  }, [borrower, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateBorrower(borrower.nisn, formData);
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
      await deleteBorrower(borrower.nisn);
      onClose();
    } catch (err) {
      setError("Gagal menghapus siswa: " + err.message);
      setLoading(false);
      setShowConfirmDelete(false);
    }
  };

  if (!isOpen || !borrower) return null;

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
                Apakah Anda yakin ingin menghapus siswa{" "}
                <strong>"{borrower.nama_siswa}"</strong>? Data peminjaman
                terkait mungkin akan terpengaruh.
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
            Edit Data Siswa
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              title="Hapus Siswa"
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
              <label className="label">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="nama_siswa"
                  value={formData.nama_siswa}
                  onInput={handleChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">NISN</label>
                <input
                  type="text"
                  name="nisn"
                  value={formData.nisn}
                  onInput={handleChange}
                  className="input font-mono"
                  readOnly // Usually NISN is a primary key or unique identifier, maybe shouldn't be editable easily or at all
                  disabled
                  title="NISN tidak dapat diubah"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  NISN tidak dapat diubah (Primary Key)
                </p>
              </div>
              <div>
                <label className="label">Kelas</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onInput={handleChange}
                    className="input pl-10"
                    required
                  />
                </div>
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
