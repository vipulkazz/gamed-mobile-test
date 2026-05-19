import { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useProfile } from "@/src/hooks/useProfile";
import { useSessions } from "@/src/hooks/useSessions";
import { useAuthStore } from "@/src/stores/authStore";
import { LoadingState } from "@/src/components/LoadingState";
import { ErrorState } from "@/src/components/ErrorState";
import { Button } from "@/src/components/Button";
import { PlatformRow } from "@/src/components/PlatformRow";
import { SessionCard } from "@/src/components/SessionCard";
import { GlassCard } from "@/src/components/skia/GlassCard";
import { AnimatedHeroBackground } from "@/src/components/skia/AnimatedHeroBackground";
import { GigiScoreRing } from "@/src/components/skia/GigiScoreRing";
import { Platform } from "@/src/types";

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useProfile();
  const sessions = useSessions(5);
  const signOut = useAuthStore((s) => s.signOut);
  const { width, height } = Dimensions.get("window");

  const refetchProfile = profile.refetch;
  const refetchSessions = sessions.refetch;
  const onRefresh = useCallback(() => {
    refetchProfile();
    refetchSessions();
  }, [refetchProfile, refetchSessions]);

  const onPressPlatform = (p: Platform) => {
    router.push(`/connect/${p.id}`);
  };

  // Drive ring fade + scale from scroll position. Only collapses when the
  // user scrolls down (content moves up); reverses cleanly on scroll back.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const ringStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 180], [1, 0], "clamp");
    const scale = interpolate(scrollY.value, [0, 220], [1, 0.85], "clamp");
    return { opacity, transform: [{ scale }] };
  });

  if (profile.isPending) return <LoadingState />;

  if (profile.isError) {
    const message =
      profile.error instanceof Error
        ? profile.error.message
        : "Could not load profile.";
    return (
      <ErrorState
        title="Couldn't load your profile"
        message={message}
        onRetry={() => profile.refetch()}
      />
    );
  }

  const user = profile.data;

  return (
    <View className="flex-1 bg-bg">
      {/* Full-screen animated background. Glass cards above blur this. */}
      <AnimatedHeroBackground width={width} height={height} />

      <SafeAreaView edges={["top"]} className="flex-1">
        <Animated.ScrollView
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={profile.isRefetching || sessions.isRefetching}
              onRefresh={onRefresh}
              tintColor="#7C5CFF"
            />
          }
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* INDEX 0 — sticky profile header */}
          <View className="bg-bg/70 px-6 pt-2 pb-3 flex-row items-start justify-between">
            <View className="gap-1">
              <Text className="text-text/50 text-[10px] uppercase tracking-[3px]">
                Profile
              </Text>
              <Text className="text-text font-display text-2xl">
                {user.displayName}
              </Text>
              <Text className="text-text/60 text-xs">
                GAMED ID · {user.gamedId}
              </Text>
            </View>
            <Button
              label="Sign out"
              variant="ghost"
              onPress={() => {
                signOut();
              }}
            />
          </View>

          {/* Score ring — fades + scales away on scroll */}
          <Animated.View
            style={ringStyle}
            className="items-center justify-center py-6"
          >
            <GigiScoreRing
              score={user.gigiScore}
              percentile={user.globalPercentile}
              size={210}
            />
          </Animated.View>

          {/* Platforms */}
          <View className="px-6 gap-3">
            <Text className="text-text/50 text-[10px] uppercase tracking-[3px]">
              Platforms
            </Text>
            <View className="gap-2">
              {user.platforms.map((p) => (
                <PlatformRow
                  key={p.id}
                  platform={p}
                  onPress={() => onPressPlatform(p)}
                />
              ))}
            </View>
          </View>

          {/* Sessions title */}
          <View className="px-6 pt-6 pb-2">
            <Text className="text-text/50 text-[10px] uppercase tracking-[3px]">
              Recent Sessions
            </Text>
          </View>

          {sessions.isPending ? (
            <View className="py-6">
              <LoadingState />
            </View>
          ) : sessions.isError ? (
            <View className="px-6">
              <GlassCard radius={18} tint="rgba(40, 12, 22, 0.55)">
                <View className="p-4 gap-3">
                  <Text className="text-danger font-semibold">
                    Couldn&apos;t load sessions
                  </Text>
                  <Text className="text-muted text-sm">
                    {sessions.error instanceof Error
                      ? sessions.error.message
                      : "Could not load sessions."}
                  </Text>
                  <Button label="Retry" onPress={() => sessions.refetch()} />
                </View>
              </GlassCard>
            </View>
          ) : (
            <FlatList
              data={sessions.data?.sessions ?? []}
              keyExtractor={(s) => s.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="px-6 mb-3">
                  <SessionCard session={item} />
                </View>
              )}
              ListEmptyComponent={
                <Text className="text-muted text-center px-6">
                  No sessions yet.
                </Text>
              }
            />
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}
