import { useState } from "preact/hooks";
import {
  BookPlus,
  Save,
  X,
  User,
  Building2,
  Hash,
  Calendar,
  Layers,
  CheckCircle,
} from "lucide-preact";
import { addBook } from "../../stores/libraryStore";

export default function AddBookForm() {
  const [formData, setFormData] = useState({
    kode_buku: "",
    judul: "",
    penulis: "",
    penerbit: "",
    tahun_terbit: new Date().getFullYear(),
    stok_total: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "stok_total" || name === "tahun_terbit" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map form data to match store's expected format
      await addBook({
        code: formData.kode_buku,
        title: formData.judul,
        author: formData.penulis,
        publisher: formData.penerbit,
        year: formData.tahun_terbit,
        stock: formData.stok_total,
      });

      setShowSuccess(true);
      setFormData({
        kode_buku: "",
        judul: "",
        penulis: "",
        penerbit: "",
        tahun_terbit: new Date().getFullYear(),
        stok_total: 1,
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to add book", error);
      alert("Gagal menambahkan buku: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="w-full animate-fade-in pb-10">
      {/* Header */}
      <div class="mb-6">
        <h1 class="section-title">
          <BookPlus class="w-7 h-7 text-primary-600" />
          Tambah Buku Baru
        </h1>
        <p class="text-gray-500 -mt-4 ml-10">
          Lengkapi informasi buku untuk ditambahkan ke katalog
        </p>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <div class="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
          <CheckCircle class="w-5 h-5 text-green-600 flex-shrink-0" />
          <p class="text-green-800 font-medium">
            Buku berhasil ditambahkan ke katalog!
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} class="card p-6 space-y-6">
        {/* Book Code */}
        <div>
          <label class="label" for="kode_buku">
            <Hash class="w-4 h-4 inline mr-2 text-gray-500" />
            Kode Buku
          </label>
          <input
            id="kode_buku"
            type="text"
            name="kode_buku"
            value={formData.kode_buku}
            onInput={handleInputChange}
            placeholder="Contoh: NOV-001, PLJ-002"
            class="input font-mono"
            required
          />
          <p class="text-xs text-gray-400 mt-1">
            Format: [KATEGORI]-[NOMOR], contoh: NOV-001 untuk Novel
          </p>
        </div>

        {/* Book Title */}
        <div>
          <label class="label" for="judul">
            <BookPlus class="w-4 h-4 inline mr-2 text-gray-500" />
            Judul Buku
          </label>
          <input
            id="judul"
            type="text"
            name="judul"
            value={formData.judul}
            onInput={handleInputChange}
            placeholder="Masukkan judul buku..."
            class="input"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label class="label" for="penulis">
            <User class="w-4 h-4 inline mr-2 text-gray-500" />
            Penulis
          </label>
          <input
            id="penulis"
            type="text"
            name="penulis"
            value={formData.penulis}
            onInput={handleInputChange}
            placeholder="Nama penulis..."
            class="input"
          />
        </div>

        {/* Publisher */}
        <div>
          <label class="label" for="penerbit">
            <Building2 class="w-4 h-4 inline mr-2 text-gray-500" />
            Penerbit
          </label>
          <input
            id="penerbit"
            type="text"
            name="penerbit"
            value={formData.penerbit}
            onInput={handleInputChange}
            placeholder="Nama penerbit..."
            class="input"
          />
        </div>

        {/* Year & Stock Row */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Year */}
          <div>
            <label class="label" for="tahun_terbit">
              <Calendar class="w-4 h-4 inline mr-2 text-gray-500" />
              Tahun Terbit
            </label>
            <input
              id="tahun_terbit"
              type="number"
              name="tahun_terbit"
              value={formData.tahun_terbit}
              onInput={handleInputChange}
              min="1900"
              max={new Date().getFullYear()}
              class="input"
            />
          </div>

          {/* Stock */}
          <div>
            <label class="label" for="stok_total">
              <Layers class="w-4 h-4 inline mr-2 text-gray-500" />
              Jumlah Stok
            </label>
            <input
              id="stok_total"
              type="number"
              name="stok_total"
              value={formData.stok_total}
              onInput={handleInputChange}
              min="1"
              class="input"
              required
            />
          </div>
        </div>

        {/* Info Card */}
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 class="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <BookPlus class="w-5 h-5" />
            Panduan Pengisian
          </h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>
              • <b>Kode Buku</b>: Gunakan format yang konsisten, contoh: NOV
              untuk Novel, PLJ untuk Pelajaran
            </li>
            <li>
              • <b>Penerbit</b>: Masukkan nama penerbit sesuai yang tertera di
              buku
            </li>
            <li>
              • Stok yang dimasukkan adalah jumlah total buku yang tersedia
            </li>
          </ul>
        </div>

        {/* Form Actions */}
        <div class="flex items-center gap-3 pt-4 border-t border-base-200">
          <button
            type="submit"
            disabled={isSubmitting}
            class="btn btn-primary flex-1 md:flex-none"
          >
            {isSubmitting ? (
              <>
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save class="w-5 h-5" />
                Simpan Buku
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                kode_buku: "",
                judul: "",
                penulis: "",
                penerbit: "",
                tahun_terbit: new Date().getFullYear(),
                stok_total: 1,
              })
            }
            class="btn btn-ghost"
          >
            <X class="w-5 h-5" />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
