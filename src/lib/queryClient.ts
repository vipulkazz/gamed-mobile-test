import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";
import { useAuthStore } from "@/src/stores/authStore";

function handleAuthError(error: unknown): void {
  if (error instanceof ApiError && error.status === 401) {
    // Only sign out if we actually have a session — a 401 from the login
    // mutation itself means bad credentials, not an expired session.
    if (useAuthStore.getState().accessToken) {
      void useAuthStore.getState().signOut();
    }
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleAuthError }),
  mutationCache: new MutationCache({ onError: handleAuthError }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const QK = {
  profile: ["profile"] as const,
  sessions: ["sessions"] as const,
};
