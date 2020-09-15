import { useFetch, CachePolicies } from "use-http";

export function useAPI() {
  const api = useFetch("/api", {
    cachePolicy: CachePolicies.NO_CACHE,
  });

  return api;
}
