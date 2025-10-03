import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../lib/axiosClient";
import { useAuth } from "../hooks/useAuth";

export default function UpdateProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [inventory, setInventory] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/products/${id}`);
        const p = res.data;
        setTitle(p.title);
        setDescription(p.description);
        setPrice(p.price);
        setInventory(p.inventory);
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.patch(
        `/products/${id}`,
        { title, description, price, inventory },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("✅ Product updated");
      navigate(`/products/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Delete failed:", err.message);
        alert(err.message);
      } else {
        console.error("Delete failed:", err);
        alert("An unknown error occurred");
      }
    }
  };

  if (loading) return <p className="p-6">Loading product...</p>;
  if (user?.role !== "ADMIN") return <p>Unauthorized</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          title="Title"
          className="w-full border p-2 rounded"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          title="Description of the product"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          title="Price"
          className="w-full border p-2 rounded"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <input
          title="Inventory"
          className="w-full border p-2 rounded"
          type="number"
          value={inventory}
          onChange={(e) => setInventory(Number(e.target.value))}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
