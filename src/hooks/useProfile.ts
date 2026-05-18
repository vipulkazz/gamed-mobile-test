import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/src/lib/api";
import { QK } from "@/src/lib/queryClient";
import { useAuthStore } from "@/src/stores/authStore";
import { User } from "@/src/types";

export function useProfile() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery<User>({
    queryKey: QK.profile,
    enabled: !!token,
    queryFn: () => {
      if (!token) throw new Error("Not authenticated");
      return fetchProfile(token);
    },
  });
}
