import { useEffect, useState } from "react";
import { Dimensions, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePlatformConnection } from "@/src/hooks/useConnectPlatform";
import { useProfile } from "@/src/hooks/useProfile";
import { Button } from "@/src/components/Button";
import { ErrorState } from "@/src/components/ErrorState";
import { LoadingState } from "@/src/components/LoadingState";
import { AnimatedHeroBackground } from "@/src/components/skia/AnimatedHeroBackground";
import { ConfettiBurst } from "@/src/components/skia/ConfettiBurst";
import { GlassCard } from "@/src/components/skia/GlassCard";
import { PlatformLogo } from "@/src/components/skia/PlatformLogo";
import { PlatformIdSchema } from "@/src/types";

type Benefit = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  detail: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: "trophy-outline",
    label: "Achievements",
    detail: "Trophies, badges, and ranked milestones",
  },
  {
    icon: "game-controller-outline",
    label: "Match history",
    detail: "Your last 500 sessions, auto-synced",
  },
  {
    icon: "trending-up-outline",
    label: "Performance stats",
    detail: "APM, K/D, accuracy, win-rate",
  },
  {
    icon: "people-outline",
    label: "Friends & social",
    detail: "Your network, ready to invite",
  },
];

export default function ConnectPlatformScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ platform: string }>();
  const parsed = PlatformIdSchema.safeParse(params.platform);
  const profile = useProfile();
  const mutation = usePlatformConnection();
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const { width, height } = Dimensions.get("window");

  // Confetti only on a successful CONNECT (not disconnect); navigate back
  // shortly after either kind of success.
  useEffect(() => {
    if (mutation.isSuccess) {
      if (mutation.variables?.connected) {
        setConfettiTrigger((n) => n + 1);
      }
      const t = setTimeout(() => router.back(), 900);
      return () => clearTimeout(t);
    }
  }, [mutation.isSuccess, mutation.variables, router]);

  if (!parsed.success) {
    return (
      <ErrorState
        title="Unknown platform"
        message={`"${params.platform}" is not a supported platform.`}
        onRetry={() => router.back()}
      />
    );
  }

  if (profile.isPending) return <LoadingState />;
  if (profile.isError || !profile.data) {
    return (
      <ErrorState
        message="Couldn't load your profile."
        onRetry={() => profile.refetch()}
      />
    );
  }

  const platformId = parsed.data;
  const platform = profile.data.platforms.find((p) => p.id === platformId);

  if (!platform) {
    return (
      <ErrorState
        title="Platform not found"
        message="This platform is not on your profile."
      />
    );
  }

  const isConnected = platform.connected;

  const onConnect = () => {
    mutation.mutate({ platform: platformId, connected: true, simulateFailure });
  };
  const onDisconnect = () => {
    mutation.mutate({
      platform: platformId,
      connected: false,
      simulateFailure,
    });
  };

  const errorMessage =
    mutation.isError && mutation.error instanceof Error
      ? mutation.error.message
      : null;

  return (
    <View className="flex-1 bg-bg">
      <AnimatedHeroBackground width={width} height={height} />
      <ConfettiBurst trigger={confettiTrigger} />

      <SafeAreaView edges={["bottom"]} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: insets.top + 60,
            paddingBottom: 16,
          }}
        >
          {/* Hero */}
          <View className="items-center px-8 pt-2 pb-6 gap-3">
            <PlatformLogo
              id={platformId}
              connected={isConnected}
              size={96}
            />
            <Text className="text-text/50 text-[10px] uppercase tracking-[3px] mt-2">
              {isConnected ? "Connected platform" : "Connect platform"}
            </Text>
            <Text className="text-text font-display text-4xl">
              {platform.name}
            </Text>
            <Text className="text-text/70 text-sm text-center">
              {isConnected
                ? `GAMED is currently syncing your ${platform.name} matches, achievements, and stats.`
                : `Link your ${platform.name} account so GAMED can pull your matches and track your progress across every session.`}
            </Text>
          </View>

          {/* Status / Benefits */}
          {isConnected ? (
            <View className="px-6 mb-4">
              <GlassCard radius={20} tint="rgba(15, 50, 30, 0.45)">
                <View className="flex-row items-center gap-3 p-4">
                  <View className="w-9 h-9 rounded-xl bg-success/15 items-center justify-center">
                    <Ionicons name="checkmark" size={20} color="#3DDC97" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-success font-semibold">
                      Connected & syncing
                    </Text>
                    <Text className="text-text/55 text-xs">
                      Disconnecting will stop new matches from being pulled. Your
                      existing history is preserved.
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </View>
          ) : (
            <View className="px-6 mb-4 gap-2">
              <Text className="text-text/50 text-[10px] uppercase tracking-[3px] mb-1 px-1">
                We&apos;ll sync
              </Text>
              <GlassCard radius={20}>
                <View className="px-4 py-3">
                  {BENEFITS.map((b, i) => (
                    <View
                      key={b.icon}
                      className={`flex-row items-center gap-3 py-3 ${
                        i !== BENEFITS.length - 1
                          ? "border-b border-white/5"
                          : ""
                      }`}
                    >
                      <View className="w-9 h-9 rounded-xl bg-accent/15 items-center justify-center">
                        <Ionicons name={b.icon} size={18} color="#A78BFA" />
                      </View>
                      <View className="flex-1 gap-0.5">
                        <Text className="text-text text-sm font-semibold">
                          {b.label}
                        </Text>
                        <Text className="text-text/55 text-xs">{b.detail}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </View>
          )}

          {/* Simulate failure */}
          <View className="px-6 mb-4">
            <GlassCard radius={20}>
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-1 pr-3 gap-0.5">
                  <Text className="text-text font-semibold text-sm">
                    Simulate failure
                  </Text>
                  <Text className="text-text/55 text-xs">
                    Server returns 500 — verify optimistic rollback
                  </Text>
                </View>
                <Switch
                  value={simulateFailure}
                  onValueChange={setSimulateFailure}
                  trackColor={{ false: "#26263A", true: "#7C5CFF" }}
                  thumbColor="#F4F4F6"
                />
              </View>
            </GlassCard>
          </View>

          {/* Error card */}
          {errorMessage ? (
            <View className="px-6 mb-4">
              <GlassCard radius={20} tint="rgba(40, 12, 22, 0.55)">
                <View className="p-4 gap-3">
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="alert-circle"
                      size={18}
                      color="#FF5C7A"
                    />
                    <Text className="text-danger font-semibold">
                      {isConnected
                        ? "Disconnection failed"
                        : "Connection failed"}
                    </Text>
                  </View>
                  <Text className="text-text/70 text-sm">{errorMessage}</Text>
                  <Button
                    label="Retry"
                    onPress={isConnected ? onDisconnect : onConnect}
                    loading={mutation.isPending}
                    disabled={mutation.isPending}
                  />
                </View>
              </GlassCard>
            </View>
          ) : null}
        </ScrollView>

        {/* Sticky CTA */}
        <View className="px-6 gap-3 pt-2 pb-2">
          {isConnected ? (
            <Button
              label={
                mutation.isPending
                  ? "Disconnecting…"
                  : `Disconnect ${platform.name}`
              }
              variant="danger"
              onPress={onDisconnect}
              loading={mutation.isPending}
              disabled={mutation.isPending}
            />
          ) : (
            <Button
              label={
                mutation.isPending
                  ? "Connecting…"
                  : `Connect ${platform.name}`
              }
              onPress={onConnect}
              loading={mutation.isPending}
              disabled={mutation.isPending}
            />
          )}
          <Button
            label="Cancel"
            variant="ghost"
            onPress={() => router.back()}
            disabled={mutation.isPending}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
