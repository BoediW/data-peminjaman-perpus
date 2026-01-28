import { useState } from "preact/hooks";
import {
  BookPlus,
  Save,
  X,
  Tag,
  Building2,
  Hash,
  Calendar,
  Layers,
  CheckCircle,
} from "lucide-preact";
import { addBook, categories } from "../../stores/libraryStore";
import Dropdown from "../ui/Dropdown";

export default function AddBookForm() {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    publisher: "",
    category: "",
    year: new Date().getFullYear(),
    stock: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "stock" || name === "year" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    addBook(formData);

    setShowSuccess(true);
    setFormData({
      title: "",
      code: "",
      publisher: "",
      category: "",
      year: new Date().getFullYear(),
      stock: 1,
    });
    setIsSubmitting(false);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const existingCategories = categories.value.filter((c) => c !== "all");

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
        {/* Book Title */}
        <div>
          <label class="label" for="title">
            <BookPlus class="w-4 h-4 inline mr-2 text-gray-500" />
            Nama Buku
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onInput={handleInputChange}
            placeholder="Masukkan nama buku..."
            class="input"
            required
          />
        </div>

        {/* Book Code */}
        <div>
          <label class="label" for="code">
            <Hash class="w-4 h-4 inline mr-2 text-gray-500" />
            Kode Buku
          </label>
          <input
            id="code"
            type="text"
            name="code"
            value={formData.code}
            onInput={handleInputChange}
            placeholder="Contoh: NOV-001, PLJ-002"
            class="input font-mono"
            required
          />
          <p class="text-xs text-gray-400 mt-1">
            Format: [KATEGORI]-[NOMOR], contoh: NOV-001 untuk Novel
          </p>
        </div>

        {/* Publisher */}
        <div>
          <label class="label" for="publisher">
            <Building2 class="w-4 h-4 inline mr-2 text-gray-500" />
            Penerbit
          </label>
          <input
            id="publisher"
            type="text"
            name="publisher"
            value={formData.publisher}
            onInput={handleInputChange}
            placeholder="Nama penerbit..."
            class="input"
            required
          />
        </div>

        {/* Category & Year Row */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <Dropdown
              label="Kategori"
              name="category"
              value={formData.category}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, category: val }))
              }
              options={[
                ...existingCategories,
                "Novel",
                "Pelajaran",
                "Referensi",
                "Komik",
                "Majalah",
              ].filter((v, i, a) => a.indexOf(v) === i)} // Unique values
              placeholder="Pilih kategori..."
              icon={Tag}
              required
            />
          </div>

          {/* Year */}
          <div>
            <label class="label" for="year">
              <Calendar class="w-4 h-4 inline mr-2 text-gray-500" />
              Tahun Terbit
            </label>
            <input
              id="year"
              type="number"
              name="year"
              value={formData.year}
              onInput={handleInputChange}
              min="1900"
              max={new Date().getFullYear()}
              class="input"
              required
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label class="label" for="stock">
            <Layers class="w-4 h-4 inline mr-2 text-gray-500" />
            Jumlah Stok
          </label>
          <input
            id="stock"
            type="number"
            name="stock"
            value={formData.stock}
            onInput={handleInputChange}
            min="1"
            class="input"
            required
          />
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
                title: "",
                code: "",
                publisher: "",
                category: "",
                year: new Date().getFullYear(),
                stock: 1,
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
