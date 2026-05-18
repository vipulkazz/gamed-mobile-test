import { Redirect } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";

export default function Index() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return <Redirect href={accessToken ? "/profile" : "/login"} />;
}
