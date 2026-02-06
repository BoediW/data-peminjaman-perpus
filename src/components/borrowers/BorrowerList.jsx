import { useState } from "preact/hooks";
import {
  Users,
  Search,
  UserPlus,
  GraduationCap,
  BookOpen,
  MoreVertical,
  Eye,
  Disc,
  Sparkles,
} from "lucide-preact";
import {
  borrowers,
  getActiveLoansByBorrower,
  activeTab,
} from "../../stores/libraryStore";
import ModalsBorrower from "./modals/ModalsBorrower";
import EditBorrower from "./modals/EditBorrower";

function BorrowerCard({ borrower, onDetail }) {
  const activeLoans = getActiveLoansByBorrower(borrower.nisn);

  return (
    <div className="group bg-nerissa-midnight/40 backdrop-blur-xl border border-white/5 rounded-nerissa-lg overflow-hidden hover:border-nerissa-teal/30 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-nerissa">
      <div className="p-6 relative">
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDetail(borrower)}
            className="p-2 bg-white/5 hover:bg-nerissa-teal hover:text-nerissa-onyx rounded-full transition-colors text-gray-400"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-nerissa-teal to-nerissa-purple p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-500">
            <div className="w-full h-full bg-nerissa-onyx rounded-full flex items-center justify-center">
              <span className="text-xl font-black text-white">
                {borrower.nama_siswa?.charAt(0) || "?"}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white group-hover:text-nerissa-teal transition-colors line-clamp-1">
              {borrower.nama_siswa}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                Kelas {borrower.kelas}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-mono bg-black/20 p-2 rounded border border-white/5">
          <span className="text-nerissa-teal font-bold select-none">ID:</span>
          {borrower.nisn}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-gray-500">
            <span>Status Peminjaman</span>
            <span
              className={
                activeLoans.length > 0 ? "text-nerissa-teal" : "text-gray-600"
              }
            >
              {activeLoans.length} Buku
            </span>
          </div>

          {activeLoans.length > 0 ? (
            <div className="bg-white/5 rounded p-3 border border-white/5">
              {activeLoans.slice(0, 2).map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center gap-2 text-xs py-1 first:pt-0 last:pb-0 border-b border-white/5 last:border-0"
                >
                  <BookOpen className="w-3 h-3 text-nerissa-teal/70" />
                  <span className="text-gray-300 truncate max-w-[150px]">
                    {loan.book?.title}
                  </span>
                </div>
              ))}
              {activeLoans.length > 2 && (
                <div className="pt-2 text-[10px] text-center text-gray-500 italic">
                  +{activeLoans.length - 2} buku lainnya
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-center border border-dashed border-white/10 rounded">
              <p className="text-[10px] text-gray-600 italic">
                Tidak ada pinjaman aktif
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-transparent via-nerissa-teal/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  );
}

export default function BorrowerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredBorrowers = borrowers.value.filter((siswa) => {
    const query = searchQuery.toLowerCase();
    return (
      siswa.nama_siswa?.toLowerCase().includes(query) ||
      siswa.nisn?.includes(query) ||
      siswa.kelas?.toLowerCase().includes(query)
    );
  });

  const handleDetail = (borrower) => {
    setSelectedBorrower(borrower);
    setIsInfoOpen(true);
  };

  const handleEdit = () => {
    setIsInfoOpen(false);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-nerissa-teal/40"></div>
            <span className="text-[10px] font-black text-nerissa-teal uppercase tracking-[0.4em] leading-none">
              Members
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase">
            Data Siswa
          </h1>
          <p className="text-gray-500 text-sm mt-3 font-medium tracking-tight">
            Komunitas pembaca di seluruh spektrum.
          </p>
        </div>

        <button
          onClick={() => (activeTab.value = "add-borrower")}
          className="btn btn-primary group h-12 px-8"
        >
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Registrasi Siswa</span>
        </button>
      </div>

      {/* Search & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative group">
          <div className="absolute inset-0 bg-nerissa-teal/5 rounded-nerissa blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-nerissa-teal transition-colors" />
            <input
              type="text"
              placeholder="Cari nama, NISN, atau kelas..."
              value={searchQuery}
              onInput={(e) => setSearchQuery(e.target.value)}
              className="input pl-14 h-16 text-lg bg-nerissa-midnight/60 border-white/10 rounded-nerissa focus:border-nerissa-teal/50"
            />
          </div>
        </div>

        <div className="bg-nerissa-midnight/40 border border-white/5 rounded-nerissa p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
              Total Members
            </p>
            <p className="text-3xl font-display font-black text-white">
              {borrowers.value.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <Users className="w-6 h-6 text-nerissa-teal" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {["7", "8", "9"].map((cls) => (
          <div
            key={cls}
            className="flex-1 min-w-[140px] bg-white/5 border border-white/5 rounded-nerissa p-4 hover:bg-white/10 transition-colors"
          >
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">
              Kelas {cls}
            </p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-white leading-none">
                {borrowers.value.filter((b) => b.kelas?.startsWith(cls)).length}
              </span>
              <div className="h-1 w-8 bg-nerissa-teal/50 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Borrowers Grid */}
      {filteredBorrowers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredBorrowers.map((borrower) => (
            <BorrowerCard
              key={borrower.nisn}
              borrower={borrower}
              onDetail={handleDetail}
            />
          ))}
        </div>
      ) : (
        <div className="card py-32 flex flex-col items-center justify-center text-center bg-nerissa-midnight/20 border-white/5">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Users className="w-12 h-12 text-gray-700" />
          </div>
          <h3 className="text-xl font-display font-black text-gray-600 uppercase tracking-[0.3em]">
            Data Tidak Ditemukan
          </h3>
          <p className="text-gray-700 mt-2 font-medium">
            Sinyal pencarian tidak mendeteksi siswa.
          </p>
        </div>
      )}

      {/* Modals */}
      <ModalsBorrower
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        borrower={selectedBorrower}
        onEdit={handleEdit}
      />

      <EditBorrower
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        borrower={selectedBorrower}
      />
    </div>
  );
}
