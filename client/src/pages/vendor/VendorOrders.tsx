import { RecentOrders } from "@/components/RecentOrders";
import { VendorLayout } from "@/components/VendorLayout";

export default function VendorOrders() {
  return (
    <VendorLayout>
      <div className="space-y-6 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <RecentOrders />
      </div>
    </VendorLayout>
  );
}
