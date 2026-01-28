import { useState } from "preact/hooks";
import {
  UserPlus,
  Save,
  X,
  User,
  GraduationCap,
  Hash,
  CheckCircle,
} from "lucide-preact";
import { addBorrower } from "../../stores/libraryStore";
import Dropdown from "../ui/Dropdown";

export default function AddBorrowerForm() {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    nis: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const classOptions = [
    "7A",
    "7B",
    "7C",
    "7D",
    "8A",
    "8B",
    "8C",
    "8D",
    "9A",
    "9B",
    "9C",
    "9D",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    addBorrower(formData);

    setShowSuccess(true);
    setFormData({
      name: "",
      class: "",
      nis: "",
    });
    setIsSubmitting(false);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div class="w-full animate-fade-in pb-10">
      {/* Header */}
      <div class="mb-6">
        <h1 class="section-title">
          <UserPlus class="w-7 h-7 text-primary-600" />
          Tambah Peminjam Baru
        </h1>
        <p class="text-gray-500 -mt-4 ml-10">
          Daftarkan siswa baru sebagai anggota perpustakaan
        </p>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <div class="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
          <CheckCircle class="w-5 h-5 text-green-600 flex-shrink-0" />
          <p class="text-green-800 font-medium">
            Peminjam berhasil didaftarkan!
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} class="card p-6 space-y-6">
        {/* Name */}
        <div>
          <label class="label" for="name">
            <User class="w-4 h-4 inline mr-2 text-gray-500" />
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onInput={handleInputChange}
            placeholder="Masukkan nama lengkap siswa..."
            class="input"
            required
          />
        </div>

        {/* Class & NIS Row */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class */}
          <div>
            <Dropdown
              label="Kelas"
              name="class"
              value={formData.class}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, class: val }))
              }
              options={classOptions}
              placeholder="Pilih kelas..."
              icon={GraduationCap}
              required
            />
          </div>

          {/* NIS */}
          <div>
            <label class="label" for="nis">
              <Hash class="w-4 h-4 inline mr-2 text-gray-500" />
              NIS (Nomor Induk Siswa)
            </label>
            <input
              id="nis"
              type="text"
              name="nis"
              value={formData.nis}
              onInput={handleInputChange}
              placeholder="Contoh: 2024001"
              class="input"
              required
            />
          </div>
        </div>

        {/* Info Card */}
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 class="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <GraduationCap class="w-5 h-5" />
            Informasi Pendaftaran
          </h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>
              • Pastikan NIS tidak duplikat dengan siswa yang sudah terdaftar
            </li>
            <li>• Nama yang dimasukkan akan ditampilkan di kartu anggota</li>
            <li>• Setelah terdaftar, siswa dapat langsung meminjam buku</li>
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
                Daftarkan Peminjam
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFormData({ name: "", class: "", nis: "" })}
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
