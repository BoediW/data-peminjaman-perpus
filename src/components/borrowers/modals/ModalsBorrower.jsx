import {
  X,
  User,
  GraduationCap,
  BookOpen,
  Clock,
  AlertTriangle,
  Edit,
} from "lucide-preact";
import {
  getActiveLoansByBorrower,
  formatDate,
} from "../../../stores/libraryStore";

export default function ModalsBorrower({ isOpen, onClose, borrower, onEdit }) {
  if (!isOpen || !borrower) return null;

  const activeLoans = getActiveLoansByBorrower(borrower.nisn);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-nerissa-onyx/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-nerissa-midnight border border-white/10 rounded-nerissa-lg shadow-2xl overflow-hidden animate-slide-up">
        {/* Header with Avatar */}
        <div className="relative h-40 bg-gradient-to-r from-nerissa-teal/10 to-nerissa-purple/10 overflow-hidden flex items-end p-8 pb-0">
          <div className="absolute inset-0 opacity-20 pointer-events-none sound-wave"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-0 right-0 w-64 h-64 bg-nerissa-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full bg-nerissa-midnight p-1.5 shadow-xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-nerissa-teal to-nerissa-purple flex items-center justify-center text-4xl font-black text-nerissa-onyx">
                {borrower.nama_siswa?.charAt(0) || "?"}
              </div>
            </div>
            <button onClick={onEdit} className="btn btn-outline text-xs px-4">
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase leading-none mb-2">
              {borrower.nama_siswa}
            </h2>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <GraduationCap className="w-4 h-4 text-nerissa-purple" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Kelas {borrower.kelas}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <User className="w-4 h-4 text-nerissa-teal" />
                <span className="tracking-wider">{borrower.nisn}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Peminjaman Aktif
              </h3>

              {activeLoans.length > 0 ? (
                <div className="grid gap-3">
                  {activeLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="bg-white/5 border border-white/5 rounded-nerissa p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-nerissa-teal/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded bg-black/40 flex items-center justify-center text-gray-500 shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-nerissa-teal transition-colors">
                            {loan.book?.title}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            {loan.book?.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>Pinjam: {formatDate(loan.borrowDate)}</span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 mt-1 ${loan.status === "overdue" ? "text-red-400" : "text-nerissa-teal"}`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Tenggat: {formatDate(loan.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-nerissa bg-white/5">
                  <p className="text-gray-500 text-sm italic">
                    Tidak ada buku yang sedang dipinjam.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
