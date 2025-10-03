import { useOrders } from "../hooks/useOrders";
import { Package, DollarSign, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-200 p-12">
          <ShoppingBag className="text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            When customers place orders, they will appear here for you to
            manage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">
          {orders.length} {orders.length === 1 ? "order" : "orders"} total
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Order ID
                </p>
                <p className="text-xl font-bold text-gray-900">#{order.id}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2">
                <ShoppingBag className="text-blue-600" size={20} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={16} />
                  <span className="text-sm font-medium">Total</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package size={16} />
                  <span className="text-sm font-medium">Items</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
