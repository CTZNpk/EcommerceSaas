import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import usePaginatedFetch from "@/hooks/usePaginatedFetch";
import { IUser } from "@/types/userInterface";

export default function Users() {
  const [filters, setFilters] = useState({ username: "", accountType: "" });
  const { items, fetchMore, error, loading, hasMore, refetch } =
    usePaginatedFetch<IUser>("/admin/get-users", {}, true);

  // useEffect(() => {
  //   refetch();
  // }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <div className="space-y-6 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>

        <div className="flex space-x-4">
          <Input
            placeholder="Search by name..."
            value={filters.username}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
          <Select
            onValueChange={(value) => handleFilterChange("accountType", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Vendors">Vendors</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => refetch()} disabled={loading}>
            {loading ? "Loading..." : "Apply Filters"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg mt-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Users List */}
        <div className="border rounded-lg p-4 bg-white shadow">
          {loading && items.length === 0 ? (
            <p>Loading users...</p>
          ) : items.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="p-4">
                    <p className="font-semibold">{item.username}</p>
                    <p className="text-sm text-gray-600">
                      Account Type: {item.accountType}
                    </p>
                  </li>
                ))}
              </ul>
              {hasMore && (
                <div className="mt-4 text-center">
                  <Button onClick={fetchMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
