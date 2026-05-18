import { create } from "zustand";
import { clearTokens, loadTokens, saveTokens } from "@/src/lib/secureStore";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,
  hydrate: async () => {
    const tokens = await loadTokens();
    set({
      accessToken: tokens?.accessToken ?? null,
      refreshToken: tokens?.refreshToken ?? null,
      hydrated: true,
    });
  },
  setTokens: async (tokens) => {
    await saveTokens(tokens);
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  },
  signOut: async () => {
    await clearTokens();
    set({ accessToken: null, refreshToken: null });
  },
}));
