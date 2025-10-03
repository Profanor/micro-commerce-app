import { useProducts } from "../hooks/useProducts";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="mt-2 text-gray-600">
          Browse our complete product catalog
        </p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="group block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {p.title}
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${p.price}
                  </span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      p.inventory > 10
                        ? "bg-green-100 text-green-800"
                        : p.inventory > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.inventory > 0
                      ? `${p.inventory} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No products found</p>
        </div>
      )}
    </div>
  );
}
