import { useState } from "preact/hooks";
import {
  Users,
  Search,
  UserPlus,
  GraduationCap,
  BookOpen,
  MoreVertical,
} from "lucide-preact";
import {
  borrowers,
  getActiveLoansByBorrower,
  activeTab,
} from "../../stores/libraryStore";

function BorrowerCard({ borrower }) {
  const activeLoans = getActiveLoansByBorrower(borrower.nisn);

  return (
    <div class="card p-5 hover:border-primary-200 transition-all duration-200 group">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-4">
          {/* Avatar */}
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
            {borrower.nama_siswa?.charAt(0) || "?"}
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
              {borrower.nama_siswa}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="badge badge-info">
                <GraduationCap class="w-3 h-3 mr-1" />
                Kelas {borrower.kelas}
              </span>
            </div>
          </div>
        </div>

        <button class="p-2 rounded-lg hover:bg-base-200 text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical class="w-5 h-5" />
        </button>
      </div>

      {/* NISN */}
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-4 px-1">
        <span class="font-medium text-gray-500">NISN:</span>
        <span class="font-mono bg-base-200 px-2 py-0.5 rounded">
          {borrower.nisn}
        </span>
      </div>

      {/* Active Loans */}
      <div class="border-t border-base-200 pt-4">
        <p class="text-sm text-gray-500 mb-2">Buku yang dipinjam:</p>
        {activeLoans.length > 0 ? (
          <div class="space-y-2">
            {activeLoans.slice(0, 2).map((loan) => (
              <div key={loan.id} class="flex items-center gap-2 text-sm">
                <BookOpen class="w-4 h-4 text-primary-500" />
                <span class="text-gray-700 truncate">{loan.book?.title}</span>
              </div>
            ))}
            {activeLoans.length > 2 && (
              <p class="text-xs text-gray-400">
                +{activeLoans.length - 2} buku lainnya
              </p>
            )}
          </div>
        ) : (
          <p class="text-sm text-gray-400 italic">Tidak ada pinjaman aktif</p>
        )}
      </div>
    </div>
  );
}

export default function BorrowerList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBorrowers = borrowers.value.filter((siswa) => {
    const query = searchQuery.toLowerCase();
    return (
      siswa.nama_siswa?.toLowerCase().includes(query) ||
      siswa.nisn?.includes(query) ||
      siswa.kelas?.toLowerCase().includes(query)
    );
  });

  return (
    <div class="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="section-title">
            <Users class="w-7 h-7 text-primary-600" />
            Data Siswa
          </h1>
          <p class="text-gray-500 -mt-4 ml-10">
            Daftar siswa yang terdaftar sebagai peminjam
          </p>
        </div>

        <button
          onClick={() => (activeTab.value = "add-borrower")}
          class="btn btn-accent"
        >
          <UserPlus class="w-5 h-5" />
          Tambah Siswa
        </button>
      </div>

      {/* Search */}
      <div class="card p-4">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, NISN, atau kelas..."
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            class="input pl-12"
          />
        </div>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p class="text-sm text-blue-600 font-medium">Total Siswa</p>
          <p class="text-2xl font-bold text-blue-800">
            {borrowers.value.length}
          </p>
        </div>
        <div class="bg-green-50 rounded-xl p-4 border border-green-100">
          <p class="text-sm text-green-600 font-medium">Kelas 7</p>
          <p class="text-2xl font-bold text-green-800">
            {borrowers.value.filter((b) => b.kelas?.startsWith("7")).length}
          </p>
        </div>
        <div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p class="text-sm text-purple-600 font-medium">Kelas 8</p>
          <p class="text-2xl font-bold text-purple-800">
            {borrowers.value.filter((b) => b.kelas?.startsWith("8")).length}
          </p>
        </div>
        <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p class="text-sm text-orange-600 font-medium">Kelas 9</p>
          <p class="text-2xl font-bold text-orange-800">
            {borrowers.value.filter((b) => b.kelas?.startsWith("9")).length}
          </p>
        </div>
      </div>

      {/* Borrowers Grid */}
      {filteredBorrowers.length > 0 ? (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBorrowers.map((borrower) => (
            <BorrowerCard key={borrower.nisn} borrower={borrower} />
          ))}
        </div>
      ) : (
        <div class="empty-state py-16">
          <Users class="w-16 h-16 text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-600 mb-2">
            Tidak ada siswa ditemukan
          </h3>
          <p class="text-gray-400">Coba ubah kata kunci pencarian</p>
        </div>
      )}
    </div>
  );
}
