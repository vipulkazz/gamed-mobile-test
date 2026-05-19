import { Platform } from "react-native";
import {
  LoginResponse,
  LoginResponseSchema,
  PlatformId,
  SessionsResponse,
  SessionsResponseSchema,
  User,
  UserSchema,
} from "@/src/types";

const HOSTED_URL = "https://gamed-mock-server.onrender.com";

const LOCAL_URL = Platform.select({
  ios: "http://localhost:4000",
  android: "http://10.0.2.2:4000",
  default: "http://localhost:4000",
});

const envUrl = process.env.EXPO_PUBLIC_API_URL;
const useLocal = process.env.EXPO_PUBLIC_USE_LOCAL_API === "1";

export const API_URL = envUrl ?? (useLocal ? LOCAL_URL : HOSTED_URL);

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

async function request<T>(
  path: string,
  options: FetchOptions,
  parse: (data: unknown) => T,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  const json: unknown = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      typeof json === "object" && json !== null && "error" in json
        ? String((json as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return parse(json);
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return request(
    "/auth/login",
    { method: "POST", body: { email, password } },
    (data) => LoginResponseSchema.parse(data),
  );
}

export async function fetchProfile(token: string): Promise<User> {
  return request("/me", { token }, (data) => UserSchema.parse(data));
}

export async function fetchSessions(
  token: string,
  limit = 5,
): Promise<SessionsResponse> {
  return request(`/me/sessions?limit=${limit}`, { token }, (data) =>
    SessionsResponseSchema.parse(data),
  );
}

export async function setPlatformConnection(
  token: string,
  platform: PlatformId,
  connected: boolean,
  fail?: boolean,
): Promise<User> {
  const query = fail ? "?fail=1" : "";
  return request(
    `/me/platforms/${platform}${query}`,
    { method: "PATCH", token, body: { connected } },
    (data) => UserSchema.parse(data),
  );
}

export { ApiError };
