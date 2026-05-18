import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "@/src/hooks/useLogin";
import { Button } from "@/src/components/Button";
import { Field } from "@/src/components/Field";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState("player@gamed.dev");
  const [password, setPassword] = useState("hunter22");
  const [touched, setTouched] = useState(false);
  const login = useLogin();

  const emailError = !email
    ? "Email is required"
    : !EMAIL_RE.test(email)
      ? "Enter a valid email"
      : undefined;
  const passwordError = !password ? "Password is required" : undefined;
  const formError = emailError || passwordError;

  const onSubmit = () => {
    setTouched(true);
    if (formError) return;
    login.mutate({ email, password });
  };

  const serverError =
    login.isError && login.error instanceof Error ? login.error.message : null;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 gap-8">
            <View className="gap-2">
              <Text className="text-accent font-display text-base uppercase tracking-[4px]">
                GAMED
              </Text>
              <Text className="text-text font-display text-4xl leading-tight">
                Where skill becomes{"\n"}legacy.
              </Text>
              <Text className="text-muted text-base">
                Sign in to your GAMED profile.
              </Text>
            </View>

            <View className="gap-4">
              <Field
                label="Email"
                placeholder="player@gamed.dev"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                error={touched ? emailError : undefined}
              />
              <Field
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                error={touched ? passwordError : undefined}
              />
              {serverError ? (
                <Text className="text-danger text-sm">{serverError}</Text>
              ) : null}
              <Button
                label="Sign in"
                onPress={onSubmit}
                loading={login.isPending}
                disabled={login.isPending}
              />
            </View>

            <Text className="text-muted text-xs text-center">
              Mock credentials are prefilled. Tap sign in to continue.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
