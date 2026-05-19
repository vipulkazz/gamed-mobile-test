import { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useLogin } from "@/src/hooks/useLogin";
import { Button } from "@/src/components/Button";
import { AnimatedHeroBackground } from "@/src/components/skia/AnimatedHeroBackground";
import { GlassCard } from "@/src/components/skia/GlassCard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useEntranceAnimation(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
  }, [delay, opacity, translateY]);
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

export default function LoginScreen() {
  const [email, setEmail] = useState("player@gamed.dev");
  const [password, setPassword] = useState("hunter22");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const login = useLogin();
  const { width, height } = Dimensions.get("window");

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

  // Staggered entrance
  const brandAnim = useEntranceAnimation(0);
  const heroAnim = useEntranceAnimation(120);
  const formAnim = useEntranceAnimation(260);
  const footerAnim = useEntranceAnimation(400);

  return (
    <View className="flex-1 bg-bg">
      <AnimatedHeroBackground width={width} height={height} />

      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand mark */}
            <Animated.View
              style={brandAnim}
              className="px-6 pt-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-accent" />
                <Text className="text-text font-display text-lg tracking-[6px]">
                  GAMED
                </Text>
              </View>
              <View className="px-3 py-1 rounded-full border border-white/10">
                <Text className="text-text/50 text-[10px] uppercase tracking-widest">
                  v1.0 · Beta
                </Text>
              </View>
            </Animated.View>

            {/* Hero */}
            <View className="px-6 gap-8">
              <Animated.View style={heroAnim} className="gap-3 mt-6">
                <Text className="text-text font-display text-[44px] leading-[1.05]">
                  Where{"\n"}
                  <Text className="text-accent">skill</Text> becomes{"\n"}
                  legacy.
                </Text>
                <Text className="text-text/60 text-base max-w-[280px]">
                  Sign in to track every match, every grade, every climb.
                </Text>
              </Animated.View>

              {/* Form card */}
              <Animated.View style={formAnim}>
                <GlassCard radius={24}>
                  <View className="p-5 gap-4">
                    <Text className="text-text/50 text-[10px] uppercase tracking-[3px]">
                      Player credentials
                    </Text>

                    {/* Email */}
                    <View className="gap-1.5">
                      <View
                        className={`flex-row items-center gap-3 rounded-2xl bg-card/60 px-4 py-3.5 border ${
                          emailFocused
                            ? "border-accent"
                            : touched && emailError
                              ? "border-danger"
                              : "border-white/10"
                        }`}
                      >
                        <Ionicons
                          name="mail-outline"
                          size={18}
                          color={emailFocused ? "#A78BFA" : "#8A8AA0"}
                        />
                        <TextInput
                          value={email}
                          onChangeText={setEmail}
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                          placeholder="player@gamed.dev"
                          placeholderTextColor="#5A5A6E"
                          autoCapitalize="none"
                          autoComplete="email"
                          keyboardType="email-address"
                          className="flex-1 text-text text-base"
                          style={{ paddingVertical: 0 }}
                        />
                      </View>
                      {touched && emailError ? (
                        <Text className="text-danger text-xs ml-1">
                          {emailError}
                        </Text>
                      ) : null}
                    </View>

                    {/* Password */}
                    <View className="gap-1.5">
                      <View
                        className={`flex-row items-center gap-3 rounded-2xl bg-card/60 px-4 py-3.5 border ${
                          pwFocused
                            ? "border-accent"
                            : touched && passwordError
                              ? "border-danger"
                              : "border-white/10"
                        }`}
                      >
                        <Ionicons
                          name="lock-closed-outline"
                          size={18}
                          color={pwFocused ? "#A78BFA" : "#8A8AA0"}
                        />
                        <TextInput
                          value={password}
                          onChangeText={setPassword}
                          onFocus={() => setPwFocused(true)}
                          onBlur={() => setPwFocused(false)}
                          placeholder="••••••••"
                          placeholderTextColor="#5A5A6E"
                          secureTextEntry={!showPassword}
                          autoComplete="password"
                          className="flex-1 text-text text-base"
                          style={{ paddingVertical: 0 }}
                        />
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={18}
                          color="#8A8AA0"
                          onPress={() => setShowPassword((v) => !v)}
                          suppressHighlighting
                        />
                      </View>
                      {touched && passwordError ? (
                        <Text className="text-danger text-xs ml-1">
                          {passwordError}
                        </Text>
                      ) : null}
                    </View>

                    {/* Server error */}
                    {serverError ? (
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name="alert-circle"
                          size={16}
                          color="#FF5C7A"
                        />
                        <Text className="text-danger text-sm flex-1">
                          {serverError}
                        </Text>
                      </View>
                    ) : null}

                    <Button
                      label={login.isPending ? "Signing in…" : "Enter the arena"}
                      onPress={onSubmit}
                      loading={login.isPending}
                      disabled={login.isPending}
                    />
                  </View>
                </GlassCard>
              </Animated.View>
            </View>

            {/* Footer */}
            <Animated.View style={footerAnim} className="px-6 pb-2 pt-8 gap-1">
              <View className="flex-row items-center justify-center gap-2">
                <View className="h-px flex-1 bg-white/8" />
                <Text className="text-text/40 text-[10px] uppercase tracking-[3px]">
                  Powered by skill
                </Text>
                <View className="h-px flex-1 bg-white/8" />
              </View>
              <Text className="text-text/40 text-xs text-center">
                Demo credentials are prefilled. Tap sign in.
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
