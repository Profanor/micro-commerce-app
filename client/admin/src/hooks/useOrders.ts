import { useEffect, useState } from "react";
import axiosClient from "../lib/axiosClient";

export interface Order {
  id: number;
  total: number;
  items: { productId: number; quantity: number; price: number }[];
  userId: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get<Order[]>("/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, fetchOrders };
}
