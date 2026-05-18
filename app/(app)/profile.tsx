import { useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
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
import { Platform } from "@/src/types";

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useProfile();
  const sessions = useSessions(5);
  const signOut = useAuthStore((s) => s.signOut);

  const onRefresh = useCallback(() => {
    profile.refetch();
    sessions.refetch();
  }, [profile, sessions]);

  const onPressPlatform = (p: Platform) => {
    if (p.connected) return;
    router.push(`/connect/${p.id}`);
  };

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
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <FlatList
        data={sessions.data?.sessions ?? []}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <View className="px-6 mb-3">
            <SessionCard session={item} />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={profile.isRefetching || sessions.isRefetching}
            onRefresh={onRefresh}
            tintColor="#7C5CFF"
          />
        }
        ListHeaderComponent={
          <View className="px-6 gap-6 pb-4">
            <View className="flex-row items-start justify-between pt-2">
              <View className="gap-1">
                <Text className="text-muted text-xs uppercase tracking-widest">
                  Profile
                </Text>
                <Text className="text-text font-display text-3xl">
                  {user.displayName}
                </Text>
                <Text className="text-muted text-sm">GAMED ID · {user.gamedId}</Text>
              </View>
              <Button
                label="Sign out"
                variant="ghost"
                onPress={() => {
                  signOut();
                }}
              />
            </View>

            <View className="bg-card border border-border rounded-3xl p-5 gap-3">
              <Text className="text-muted text-xs uppercase tracking-widest">
                GIGI Score
              </Text>
              <View className="flex-row items-end gap-3">
                <Text className="text-text font-display text-5xl">
                  {user.gigiScore}
                </Text>
                <Text className="text-success mb-2">
                  Top {(100 - user.globalPercentile).toFixed(1)}% globally
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <Text className="text-muted text-xs uppercase tracking-widest">
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

            <View className="gap-3 pt-2">
              <Text className="text-muted text-xs uppercase tracking-widest">
                Recent Sessions
              </Text>
              {sessions.isPending ? (
                <View className="py-8">
                  <LoadingState />
                </View>
              ) : sessions.isError ? (
                <ErrorState
                  message={
                    sessions.error instanceof Error
                      ? sessions.error.message
                      : "Could not load sessions."
                  }
                  onRetry={() => sessions.refetch()}
                />
              ) : null}
            </View>
          </View>
        }
        ListEmptyComponent={
          !sessions.isPending && !sessions.isError ? (
            <Text className="text-muted text-center px-6">
              No sessions yet.
            </Text>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}
