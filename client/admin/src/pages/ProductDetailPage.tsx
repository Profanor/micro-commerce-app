import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../lib/axiosClient";
import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, Edit, Trash2, Package } from "lucide-react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  inventory: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await axiosClient.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Product deleted!");
      navigate("/products");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Product Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus =
    product.inventory === 0
      ? { label: "Out of Stock", color: "text-red-600 bg-red-50" }
      : product.inventory < 10
      ? { label: "Low Stock", color: "text-orange-600 bg-orange-50" }
      : { label: "In Stock", color: "text-green-600 bg-green-50" };

  return (
    <div className="mx-auto max-w-4xl">
      {/* back button */}
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* product card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-8">
          {/* header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${stockStatus.color}`}
              >
                {stockStatus.label}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* description */}
          <div className="mb-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Description
            </h2>
            <p className="leading-relaxed text-gray-700">
              {product.description}
            </p>
          </div>

          {/* inventory info */}
          <div className="mb-8 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Inventory Level
                </p>
                <p className="text-sm text-gray-600">
                  {product.inventory} units available
                </p>
              </div>
            </div>
          </div>

          {/* admin actions */}
          {user?.role === "ADMIN" && (
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
              <Link
                to={`/products/${id}/edit`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Edit className="h-4 w-4" />
                Edit Product
              </Link>
              <button
                onClick={handleDelete}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
