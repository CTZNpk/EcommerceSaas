import { Layout } from "@/components/Layout";
import { RecentOrders } from "@/components/RecentOrders";

export default function Orders() {
  return (
    <Layout>
      <div className="space-y-6 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <RecentOrders />
      </div>
    </Layout>
  );
}
