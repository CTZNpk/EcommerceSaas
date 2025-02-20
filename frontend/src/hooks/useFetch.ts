import { IResponseInterface } from "@/interfaces/responseInterface";
import { useState } from "react";

const useFetch = () => {
  const [data, setData] = useState<IResponseInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const triggerFetch = async (
    url: string,
    options: RequestInit | null,
    includeCookies: boolean = false,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const completeUrl = "http://localhost:3000/api/v1" + url;

      const mergedOptions: RequestInit = {
        ...options,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          ...(options?.headers || {}),
        },
        credentials: includeCookies ? "include" : "omit",
      };
      const response = await fetch(completeUrl, mergedOptions);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const result = await response.json();
      setData(result.user as IResponseInterface);
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, triggerFetch };
};

export default useFetch;
