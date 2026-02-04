import { useState } from "preact/hooks";
import { activeTab } from "../stores/libraryStore";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import Dashboard from "./dashboard/Dashboard";
import BookCatalog from "./books/BookCatalog";
import AddBookForm from "./books/AddBookForm";
import BorrowerList from "./borrowers/BorrowerList";
import AddBorrowerForm from "./borrowers/AddBorrowerForm";
import LoanList from "./loans/LoanList";
import ReturnBook from "./loans/ReturnBook";

const tabs = {
  dashboard: Dashboard,
  catalog: BookCatalog,
  "add-book": AddBookForm,
  borrowers: BorrowerList,
  "add-borrower": AddBorrowerForm,
  loans: LoanList,
  return: ReturnBook,
};

export default function App() {
  const CurrentTab = tabs[activeTab.value] || Dashboard;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <div class="flex h-screen w-full overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        class={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none 
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isSidebarOpen ? "w-72" : "w-20"} shrink-0`}
      >
        <Sidebar isCollapsed={!isSidebarOpen} />
      </div>

      {/* Main Content */}
      <main class="flex-1 flex flex-col min-w-0 transition-all duration-300 h-full overflow-y-auto scroll-smooth">
        <Navbar
          onToggleSidebar={toggleSidebar}
          onToggleMobileSidebar={toggleMobileSidebar}
        />

        <div class="flex-1 overflow-x-hidden px-4 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-10 lg:px-8 lg:pt-8 lg:pb-14 h-full">
          <div class="w-full mx-auto animate-fade-in h-full">
            <CurrentTab />
          </div>
        </div>
      </main>
    </div>
  );
}
