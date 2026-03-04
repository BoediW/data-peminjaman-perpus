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
    <div class="card p-5 hover:border-zedd-violet/20 transition-all duration-200 group">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-zedd-violet to-zedd-blue flex items-center justify-center text-white font-bold text-lg shadow-zedd group-hover:scale-105 transition-transform">
            {borrower.nama_siswa?.charAt(0) || "?"}
          </div>
          <div>
            <h3 class="font-semibold text-zedd-carbon group-hover:text-zedd-violet transition-colors">
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

        <button class="p-2 rounded-lg hover:bg-zedd-glass text-zedd-steel hover:text-zedd-violet transition-colors">
          <MoreVertical class="w-5 h-5" />
        </button>
      </div>

      <div class="flex items-center gap-2 text-sm text-zedd-steel mb-4 px-1">
        <span class="font-medium text-zedd-steel">NISN:</span>
        <span class="font-mono bg-zedd-glass px-2 py-0.5 rounded border border-zedd-silver/40">
          {borrower.nisn}
        </span>
      </div>

      <div class="border-t border-zedd-silver/40 pt-4">
        <p class="text-sm text-zedd-steel mb-2">Buku yang dipinjam:</p>
        {activeLoans.length > 0 ? (
          <div class="space-y-2">
            {activeLoans.slice(0, 2).map((loan) => (
              <div key={loan.id} class="flex items-center gap-2 text-sm">
                <BookOpen class="w-4 h-4 text-zedd-violet" />
                <span class="text-zedd-carbon truncate">{loan.book?.title}</span>
              </div>
            ))}
            {activeLoans.length > 2 && (
              <p class="text-xs text-zedd-steel">
                +{activeLoans.length - 2} buku lainnya
              </p>
            )}
          </div>
        ) : (
          <p class="text-sm text-zedd-steel/60 italic">Tidak ada pinjaman aktif</p>
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
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="section-title">
            <Users class="w-7 h-7 text-zedd-violet" />
            Data Siswa
          </h1>
          <p class="text-zedd-steel -mt-4 ml-10">
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

      <div class="card p-4">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zedd-steel" />
          <input
            type="text"
            placeholder="Cari nama, NISN, atau kelas..."
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            class="input pl-12"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-zedd-violet/5 rounded-xl p-4 border border-zedd-violet/15">
          <p class="text-sm text-zedd-violet font-medium">Total Siswa</p>
          <p class="text-2xl font-bold text-zedd-carbon">
            {borrowers.value.length}
          </p>
        </div>
        <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <p class="text-sm text-emerald-600 font-medium">Kelas 7</p>
          <p class="text-2xl font-bold text-zedd-carbon">
            {borrowers.value.filter((b) => b.kelas?.startsWith("7")).length}
          </p>
        </div>
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p class="text-sm text-blue-600 font-medium">Kelas 8</p>
          <p class="text-2xl font-bold text-zedd-carbon">
            {borrowers.value.filter((b) => b.kelas?.startsWith("8")).length}
          </p>
        </div>
        <div class="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p class="text-sm text-amber-600 font-medium">Kelas 9</p>
          <p class="text-2xl font-bold text-zedd-carbon">
            {borrowers.value.filter((b) => b.kelas?.startsWith("9")).length}
          </p>
        </div>
      </div>

      {filteredBorrowers.length > 0 ? (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBorrowers.map((borrower) => (
            <BorrowerCard key={borrower.nisn} borrower={borrower} />
          ))}
        </div>
      ) : (
        <div class="empty-state py-16 text-center">
          <Users class="w-16 h-16 text-zedd-steel/20 mb-4 mx-auto" />
          <h3 class="text-lg font-medium text-zedd-steel mb-2">
            Tidak ada siswa ditemukan
          </h3>
          <p class="text-zedd-steel/60">Coba ubah kata kunci pencarian</p>
        </div>
      )}
    </div>
  );
}
