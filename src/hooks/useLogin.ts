import { useMutation } from "@tanstack/react-query";
import { login } from "@/src/lib/api";
import { useAuthStore } from "@/src/stores/authStore";
import { LoginResponse } from "@/src/types";

type LoginInput = { email: string; password: string };

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: async (data) => {
      await setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
}
