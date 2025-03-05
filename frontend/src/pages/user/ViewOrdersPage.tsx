import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";

type Order = {
  _id: number;
  orderStatus: string;
  totalAmount: number;
};

export default function ViewOrdersPage() {
  const { loading, error, triggerFetch } = useFetch();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await triggerFetch("/order/user", { method: "GET" }, true);
      if (data) setOrders(data.orders);
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Card className="w-full max-w-3xl border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Your Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-blue-600">Loading orders...</p>
          ) : error ? (
            <p className="text-center text-red-600">Error fetching orders.</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-600">No orders placed yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
                >
                  <div>
                    <h3 className="text-lg font-medium">Order #{order._id}</h3>
                    <p className="text-gray-600">Status: {order.orderStatus}</p>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    ${order.totalAmount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
