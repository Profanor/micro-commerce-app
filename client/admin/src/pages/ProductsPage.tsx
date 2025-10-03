import { useProducts } from "../hooks/useProducts";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <ul className="space-y-2">
        {products?.map((p) => (
          <li key={p.id} className="rounded border p-4 shadow">
            <Link
              to={`/products/${p.id}`}
              className="block hover:bg-gray-50 rounded p-2"
            >
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="text-gray-600">{p.description}</p>
              <p className="font-bold">${p.price}</p>
              <p className="text-sm">Stock: {p.inventory}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
