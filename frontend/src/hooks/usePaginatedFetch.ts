import { useState } from "react";
import useFetch from "./useFetch";

const usePaginatedFetch = <T,>(
  endpoint: string,
  initialParams: Record<string, string | number> = {},
  includeCookies: boolean = false,
) => {
  const { error, loading, triggerFetch } = useFetch();
  const [items, setItems] = useState<T[]>([]);
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMore = async () => {
    if (!hasMore || loading) return;

    const params = new URLSearchParams({
      ...initialParams,
      lastId: lastId || "",
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
      setItems((prev) => [...prev, ...result]);
      setLastId(result.length > 0 ? result[result.length - 1]._id : null);
      setHasMore(result.length > 0);
    }
  };

  const refetch = async () => {
    setHasMore(true);
    setItems([]);
    setLastId(null);
    await fetchMore();
  };

  return { items, fetchMore, error, loading, hasMore, refetch };
};

export default usePaginatedFetch;
