import { Trash2, Ban } from "lucide-react";
import * as COMP from "@/components";
import usePaginatedFetch from "@/hooks/usePaginatedFetch";
import useFetch from "@/hooks/useFetch";

export default function Users() {
  const { items, fetchMore, error, loading, hasMore, setQueryParams } =
    usePaginatedFetch("/admin/get-users", true);

  const { triggerFetch } = useFetch();

  const handleFilterChange = (key: string, value: string) => {
    if (key == "accountType") {
      if (value != "all") setQueryParams((prev) => ({ ...prev, [key]: value }));
      else setQueryParams((prev) => ({ ...prev, [key]: "" }));
    } else if (key == "username") {
      setQueryParams((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(id);
      await triggerFetch(
        "/admin/delete-user",
        {
          method: "POST",
          body: JSON.stringify({ userId: id }),
        },
        true,
      );
    } catch (e) {
      console.log(e);
    }
  };
  const handleBlock = async (id: string) => {
    try {
      console.log(id);
      await triggerFetch(
        "/admin/block-user",
        {
          method: "POST",
          body: JSON.stringify({ userId: id }),
        },
        true,
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <COMP.Layout>
      <div className="space-y-6 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>

        <div className="flex space-x-4">
          <COMP.Input
            placeholder="Search by name..."
            onChange={(e) => handleFilterChange("username", e.target.value)}
          />
          <COMP.Select
            onValueChange={(value) => handleFilterChange("accountType", value)}
          >
            <COMP.SelectTrigger className="w-[200px]">
              <COMP.SelectValue placeholder="Filter by Account Type" />
            </COMP.SelectTrigger>
            <COMP.SelectContent>
              <COMP.SelectItem value="all">All</COMP.SelectItem>
              <COMP.SelectItem value="vendors">Vendors</COMP.SelectItem>
              <COMP.SelectItem value="user">User</COMP.SelectItem>
            </COMP.SelectContent>
          </COMP.Select>
          <COMP.Button onClick={() => fetchMore(true)} disabled={loading}>
            {loading ? "Loading..." : "Apply Filters"}
          </COMP.Button>
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
                  <li
                    key={item._id}
                    className={`p-4 flex justify-between items-center ${
                      item.status === "deleted"
                        ? "opacity-50"
                        : item.status === "blocked"
                          ? "opacity-75"
                          : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{item.username}</p>
                      <p className="text-sm text-gray-600">
                        Account Type: {item.accountType}
                      </p>
                      {item.status === "deleted" && (
                        <p className="text-red-500 font-semibold mt-1">
                          This user has been deleted
                        </p>
                      )}
                      {item.status === "blocked" && (
                        <p className="text-orange-500 font-semibold mt-1">
                          This user has been blocked
                        </p>
                      )}
                    </div>
                    {item.status !== "deleted" && (
                      <div className="flex space-x-3">
                        {item.status !== "blocked" && (
                          <button
                            onClick={() => handleBlock(item._id)}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              {hasMore && (
                <div className="mt-4 text-center">
                  <COMP.Button
                    onClick={() => fetchMore(false)}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </COMP.Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </COMP.Layout>
  );
}
