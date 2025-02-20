import { useState } from "react";

const useFetch = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const triggerFetch = async (
    url: string,
    options: RequestInit | null,
    includeCookies: boolean = false,
    contentTypeApplication: boolean = true,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const completeUrl = "http://localhost:3000/api/v1" + url;

      const mergedOptions: RequestInit = {
        ...options,
        headers: contentTypeApplication
          ? {
              accept: "application/json",
              "content-type": "application/json",
              ...(options?.headers || {}),
            }
          : { ...(options?.headers || {}) },
        credentials: includeCookies ? "include" : "omit",
      };
      const response = await fetch(completeUrl, mergedOptions);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result);
      return result.data;
    } catch (err) {
      setError((err as Error).message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, triggerFetch };
};

export default useFetch;
