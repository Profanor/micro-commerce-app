import { useEffect, useState } from "react";
import axiosClient from "../lib/axiosClient";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  inventory: number;
  image?: string;
}

interface ProductResponse {
  totalPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  data: Product[];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get<ProductResponse>("/products");
      setProducts(res.data.data ?? []);
    } catch (err) {
      console.log(products);
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: Omit<Product, "id">) => {
    const res = await axiosClient.post<Product>("/products", product);
    setProducts((prev) => [...prev, res.data]);
  };

  const updateProduct = async (id: number, data: Partial<Product>) => {
    const res = await axiosClient.patch<Product>(`/products/${id}`, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const deleteProduct = async (id: number) => {
    await axiosClient.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
