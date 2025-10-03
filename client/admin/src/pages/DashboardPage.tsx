import { useAuth } from "../hooks/useAuth";
import { LogOut, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import axiosClient from "../lib/axiosClient";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pRes, oRes, rRes] = await Promise.all([
          axiosClient.get("/products/count"),
          axiosClient.get("/orders/count"),
          axiosClient.get("/orders/revenue"),
        ]);
        setStats({
          totalProducts: pRes.data.count,
          totalOrders: oRes.data.count,
          revenue: rRes.data.revenue,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="mb-10 flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-extrabold text-gray-800">
          Welcome, {user?.email}
        </h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-medium text-white shadow hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {/* Dashboard content */}
      <section className="mb-10 grid gap-6 sm:grid-cols-3">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={<Package className="text-blue-600" size={28} />}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="text-green-600" size={28} />}
        />
        <StatCard
          label="Revenue"
          value={stats.revenue.toLocaleString()}
          prefix="$"
          icon={<DollarSign className="text-purple-600" size={28} />}
        />
      </section>
    </div>
  );
}
