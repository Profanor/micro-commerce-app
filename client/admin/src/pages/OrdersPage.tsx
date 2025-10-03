import { useOrders } from "../hooks/useOrders";

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="rounded border p-4 shadow">
            <p className="font-semibold">Order #{o.id}</p>
            <p>Total: ${o.total}</p>
            <p>Items: {o.items.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
