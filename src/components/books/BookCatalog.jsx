import { useState } from "preact/hooks";
import {
  Search,
  Filter,
  BookOpen,
  Building2,
  Tag,
  CheckCircle,
  XCircle,
  Eye,
  BookMarked,
  Hash,
  Calendar,
  User,
} from "lucide-preact";
import {
  filteredBooks,
  searchQuery,
  selectedCategory,
  categories,
  activeTab,
} from "../../stores/libraryStore";

function BookCard({ book, index }) {
  // Use fields from 'buku' table
  const available = book.stok_tersedia || 0;
  const total = book.stok_total || 0;
  const isAvailable = available > 0;

  // Derive category from kode_buku
  const getCategory = (code) => {
    if (!code) return "Lainnya";
    if (code.startsWith("NOV")) return "Novel";
    if (code.startsWith("PLJ")) return "Pelajaran";
    if (code.startsWith("REF")) return "Referensi";
    if (code.startsWith("KOM")) return "Komik";
    return "Lainnya";
  };

  const handleBorrow = () => {
    activeTab.value = "loans";
  };

  return (
    <div
      class="card group overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Card Header with Category */}
      <div class="bg-gradient-to-r from-primary-800 to-primary-700 px-4 py-3 flex items-center justify-between">
        <span class="text-white text-xs font-medium px-2.5 py-1 bg-white/20 rounded-full backdrop-blur-sm">
          {getCategory(book.kode_buku)}
        </span>
        <span
          class={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full
          ${isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {isAvailable ? (
            <>
              <CheckCircle class="w-3.5 h-3.5" />
              Tersedia
            </>
          ) : (
            <>
              <XCircle class="w-3.5 h-3.5" />
              Habis
            </>
          )}
        </span>
      </div>

      {/* Content */}
      <div class="p-5">
        {/* Book Code */}
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-mono font-semibold">
            <Hash class="w-4 h-4" />
            {book.kode_buku}
          </span>
        </div>

        {/* Title */}
        <h3 class="font-display font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors min-h-[3.5rem]">
          {book.judul}
        </h3>

        {/* Author */}
        {book.penulis && (
          <div class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User class="w-4 h-4 text-gray-400" />
            {book.penulis}
          </div>
        )}

        {/* Publisher */}
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Building2 class="w-4 h-4 text-gray-400" />
          <span class="truncate">{book.penerbit || "-"}</span>
        </div>

        {/* Year */}
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar class="w-4 h-4 text-gray-400" />
          <span>Tahun {book.tahun_terbit || "-"}</span>
        </div>

        {/* Stock Info */}
        <div class="flex items-center justify-between pt-4 border-t border-base-200">
          <div class="flex items-center gap-2">
            <BookOpen class="w-4 h-4 text-gray-400" />
            <span class="text-sm text-gray-600">
              Stok: <span class="font-semibold text-gray-900">{available}</span>{" "}
              / {total}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div class="mt-3 h-2 bg-base-200 rounded-full overflow-hidden">
          <div
            class={`h-full rounded-full transition-all duration-500 ${available === 0
              ? "bg-red-500"
              : available < total * 0.3
                ? "bg-amber-500"
                : "bg-green-500"
              }`}
            style={{ width: `${total > 0 ? (available / total) * 100 : 0}%` }}
          ></div>
        </div>

        {/* Action Buttons */}
        <div class="mt-4 flex gap-2">
          <button class="btn btn-outline btn-sm flex-1">
            <Eye class="w-4 h-4" />
            Detail
          </button>
          {isAvailable && (
            <button onClick={handleBorrow} class="btn btn-accent btn-sm flex-1">
              <BookMarked class="w-4 h-4" />
              Pinjam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryFilter() {
  return (
    <div class="flex flex-wrap gap-2">
      {categories.value.map((cat) => (
        <button
          key={cat}
          onClick={() => (selectedCategory.value = cat)}
          class={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${selectedCategory.value === cat
              ? "bg-primary-800 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-base-200 border border-base-300"
            }`}
        >
          {cat === "all" ? "Semua" : cat}
        </button>
      ))}
    </div>
  );
}

export default function BookCatalog() {
  const booksData = filteredBooks.value;

  return (
    <div class="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="section-title">
            <BookOpen class="w-7 h-7 text-primary-600" />
            Katalog Buku
          </h1>
          <p class="text-gray-500 -mt-4 ml-10">
            Temukan dan pinjam buku yang kamu butuhkan
          </p>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span class="font-medium text-primary-700">{booksData.length}</span>{" "}
          buku ditemukan
        </div>
      </div>

      {/* Search & Filter */}
      <div class="card p-4">
        <div class="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div class="relative flex-1">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul buku, kode buku, penulis, atau penerbit..."
              value={searchQuery.value}
              onInput={(e) => (searchQuery.value = e.target.value)}
              class="input pl-12"
            />
          </div>

          {/* Filter Button (Mobile) */}
          <button class="btn btn-outline md:hidden">
            <Filter class="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Category Filters */}
        <div class="mt-4 pt-4 border-t border-base-200">
          <div class="flex items-center gap-3 mb-3">
            <Tag class="w-4 h-4 text-gray-500" />
            <span class="text-sm font-medium text-gray-600">Kategori:</span>
          </div>
          <CategoryFilter />
        </div>
      </div>

      {/* Books Grid */}
      {booksData.length > 0 ? (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {booksData.map((book, index) => (
            <BookCard key={book.kode_buku} book={book} index={index} />
          ))}
        </div>
      ) : (
        <div class="empty-state py-16">
          <BookOpen class="w-16 h-16 text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-600 mb-2">
            Tidak ada buku ditemukan
          </h3>
          <p class="text-gray-400">
            Coba ubah kata kunci pencarian atau filter kategori
          </p>
        </div>
      )}
    </div>
  );
}
