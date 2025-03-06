import { useState } from "react";
import useFetch from "./useFetch";

const usePaginatedFetch = (
  endpoint: string,
  includeCookies: boolean = false,
) => {
  const { error, loading, triggerFetch } = useFetch();
  const [items, setItems] = useState<any[]>([]);
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [queryParams, setQueryParams] = useState<
    Record<string, string | number>
  >({});

  const fetchMore = async (isRefetch: boolean) => {
    if (!isRefetch) if (!hasMore || loading) return;

    const params = new URLSearchParams({
      ...queryParams,
      lastId: isRefetch ? "" : lastId || "",
    }).toString();

    const url = `${endpoint}?${params}`;

    const result = await triggerFetch(
      url,
      {
        method: "GET",
      },
      includeCookies,
    );

    if (result) {
      const listResult = result.list;
      console.log(listResult);
      if (isRefetch) {
        setItems(listResult);
      } else {
        setItems((prev) => [...prev, ...listResult]);
      }
      setLastId(result.lastId);
      setHasMore(result.hasMore);
    }
  };

  return {
    items,
    fetchMore,
    error,
    loading,
    hasMore,
    setQueryParams,
  };
};

export default usePaginatedFetch;
