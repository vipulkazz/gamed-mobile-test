import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setPlatformConnection } from "@/src/lib/api";
import { QK } from "@/src/lib/queryClient";
import { useAuthStore } from "@/src/stores/authStore";
import { PlatformId, User } from "@/src/types";

type Vars = {
  platform: PlatformId;
  connected: boolean;
  simulateFailure?: boolean;
};
type Context = { previous: User | undefined };

export function usePlatformConnection() {
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  return useMutation<User, Error, Vars, Context>({
    mutationFn: ({ platform, connected, simulateFailure }) => {
      if (!token) throw new Error("Not authenticated");
      return setPlatformConnection(token, platform, connected, simulateFailure);
    },
    onMutate: async ({ platform, connected }) => {
      await qc.cancelQueries({ queryKey: QK.profile });
      const previous = qc.getQueryData<User>(QK.profile);
      if (previous) {
        qc.setQueryData<User>(QK.profile, {
          ...previous,
          platforms: previous.platforms.map((p) =>
            p.id === platform ? { ...p, connected } : p,
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
