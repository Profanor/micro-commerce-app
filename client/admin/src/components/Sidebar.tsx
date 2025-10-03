import { Link } from "react-router-dom";
import {
  Package,
  PlusCircle,
  ClipboardList,
  HomeIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`bg-white shadow-lg h-screen p-4 transition-all duration-300 
          fixed lg:sticky top-0 z-50
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <button
          title="Close"
          onClick={onMobileClose}
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={20} />
        </button>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
            onClick={onMobileClose}
          >
            <HomeIcon size={20} />
            {!collapsed && <span>Home</span>}
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
            onClick={onMobileClose}
          >
            <Package size={20} />
            {!collapsed && <span>Products</span>}
          </Link>
          <Link
            to="/products/create"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
            onClick={onMobileClose}
          >
            <PlusCircle size={20} />
            {!collapsed && <span>Create Product</span>}
          </Link>
          <Link
            to="/orders"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
            onClick={onMobileClose}
          >
            <ClipboardList size={20} />
            {!collapsed && <span>Orders</span>}
          </Link>
        </nav>
      </aside>
    </>
  );
}
