import { useQuery } from "@tanstack/react-query";
import { fetchSessions } from "@/src/lib/api";
import { QK } from "@/src/lib/queryClient";
import { useAuthStore } from "@/src/stores/authStore";
import { SessionsResponse } from "@/src/types";

export function useSessions(limit = 5) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery<SessionsResponse>({
    queryKey: [...QK.sessions, limit],
    enabled: !!token,
    queryFn: () => {
      if (!token) throw new Error("Not authenticated");
      return fetchSessions(token, limit);
    },
  });
}
