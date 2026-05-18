import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectPlatform } from "@/src/lib/api";
import { QK } from "@/src/lib/queryClient";
import { useAuthStore } from "@/src/stores/authStore";
import { PlatformId, User } from "@/src/types";

type Vars = { platform: PlatformId; simulateFailure?: boolean };
type Context = { previous: User | undefined };

export function useConnectPlatform() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  return useMutation<User, Error, Vars, Context>({
    mutationFn: ({ platform, simulateFailure }) => {
      if (!token) throw new Error("Not authenticated");
      return connectPlatform(token, platform, simulateFailure);
    },
    onMutate: async ({ platform }) => {
      await qc.cancelQueries({ queryKey: QK.profile });
      const previous = qc.getQueryData<User>(QK.profile);
      if (previous) {
        qc.setQueryData<User>(QK.profile, {
          ...previous,
          platforms: previous.platforms.map((p) =>
            p.id === platform ? { ...p, connected: true } : p,
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(QK.profile, context.previous);
      }
    },
    onSuccess: (data) => {
      qc.setQueryData(QK.profile, data);
    },
  });
}
