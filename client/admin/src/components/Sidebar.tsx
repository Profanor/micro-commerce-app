import { Link } from "react-router-dom";
import { Package, PlusCircle, ClipboardList, DollarSign } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`bg-white shadow-lg h-screen p-4 transition-all duration-300 
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        {collapsed ? "👉" : "👈"}
      </button>

      {/* Nav Links */}
      <nav className="flex flex-col gap-4">
        <Link
          to="/products"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
        >
          <Package size={20} />
          {!collapsed && <span>Products</span>}
        </Link>
        <Link
          to="/products/create"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
        >
          <PlusCircle size={20} />
          {!collapsed && <span>Create Product</span>}
        </Link>
        <Link
          to="/orders"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
        >
          <ClipboardList size={20} />
          {!collapsed && <span>Orders</span>}
        </Link>
        <Link
          to="/revenue"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
        >
          <DollarSign size={20} />
          {!collapsed && <span>Revenue</span>}
        </Link>
      </nav>
    </aside>
  );
}
