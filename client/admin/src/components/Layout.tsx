import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main className="flex-1 p-6 bg-gray-50 w-full lg:w-auto">
        <button
          title="Menu"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden mb-4 p-2 rounded-lg bg-white shadow hover:bg-gray-50"
        >
          <Menu size={24} />
        </button>

        <Outlet />
      </main>
    </div>
  );
}
