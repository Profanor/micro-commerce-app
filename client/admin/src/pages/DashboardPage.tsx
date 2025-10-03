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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600 break-words">
            Welcome back, {user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-red-600 transition-colors whitespace-nowrap"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
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
              value={`${stats.revenue.toFixed(2)}`}
              prefix="$"
              icon={<DollarSign className="text-purple-600" size={28} />}
            />
          </>
        )}
      </section>
    </div>
  );
}
