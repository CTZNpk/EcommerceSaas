import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import * as COMP from "@/components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import {
  ArrowDown,
  ArrowUp,
  Box,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
);

export default function Dashboard() {
  const [chartData, _] = useState({
    revenue: {
      labels: [],
      datasets: [],
    },
    orders: {
      labels: [],
      datasets: [],
    },
  });

  return (
    <COMP.Layout>
      <div className="space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <COMP.Card>
            <COMP.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <COMP.CardTitle className="text-sm font-medium">
                Total Revenue
              </COMP.CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </COMP.CardHeader>
            <COMP.CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>18.2%</span>
              </div>
            </COMP.CardContent>
          </COMP.Card>
          <COMP.Card>
            <COMP.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <COMP.CardTitle className="text-sm font-medium">
                Total Orders
              </COMP.CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </COMP.CardHeader>
            <COMP.CardContent>
              <div className="text-2xl font-bold">+1,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>15.3%</span>
              </div>
            </COMP.CardContent>
          </COMP.Card>
          <COMP.Card>
            <COMP.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <COMP.CardTitle className="text-sm font-medium">
                Active Customers
              </COMP.CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </COMP.CardHeader>
            <COMP.CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>12.5%</span>
              </div>
            </COMP.CardContent>
          </COMP.Card>
          <COMP.Card>
            <COMP.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <COMP.CardTitle className="text-sm font-medium">
                Active Vendors
              </COMP.CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </COMP.CardHeader>
            <COMP.CardContent>
              <div className="text-2xl font-bold">+89</div>
              <p className="text-xs text-muted-foreground">
                +4 since last hour
              </p>
              <div className="flex items-center text-sm text-red-600">
                <ArrowDown className="mr-1 h-4 w-4" />
                <span>2.1%</span>
              </div>
            </COMP.CardContent>
          </COMP.Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <COMP.Card className="col-span-4">
            <COMP.CardHeader>
              <COMP.CardTitle>Revenue Overview</COMP.CardTitle>
            </COMP.CardHeader>
            <COMP.CardContent>
              {chartData.revenue.datasets.length > 0 && (
                <Bar
                  data={chartData.revenue}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              )}
            </COMP.CardContent>
          </COMP.Card>
          <COMP.Card className="col-span-3">
            <COMP.CardHeader>
              <COMP.CardTitle>Orders Trend</COMP.CardTitle>
            </COMP.CardHeader>
            <COMP.CardContent>
              {chartData.orders.datasets.length > 0 && (
                <Line
                  data={chartData.orders}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              )}
            </COMP.CardContent>
          </COMP.Card>
        </div>
        <COMP.RecentOrders />
      </div>
    </COMP.Layout>
  );
}
