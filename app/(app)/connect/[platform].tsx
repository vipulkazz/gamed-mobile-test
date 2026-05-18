import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConnectPlatform } from "@/src/hooks/useConnectPlatform";
import { useProfile } from "@/src/hooks/useProfile";
import { Button } from "@/src/components/Button";
import { ErrorState } from "@/src/components/ErrorState";
import { LoadingState } from "@/src/components/LoadingState";
import { PlatformIdSchema } from "@/src/types";

export default function ConnectPlatformScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ platform: string }>();
  const parsed = PlatformIdSchema.safeParse(params.platform);
  const profile = useProfile();
  const mutation = useConnectPlatform();
  const [simulateFailure, setSimulateFailure] = useState(false);

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

  const onConnect = () => {
    mutation.mutate(
      { platform: platformId, simulateFailure },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  const errorMessage =
    mutation.isError && mutation.error instanceof Error
      ? mutation.error.message
      : null;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["bottom"]}>
      <View className="flex-1 px-6 pt-6 gap-8">
        <View className="gap-3">
          <Text className="text-muted text-xs uppercase tracking-widest">
            Connect platform
          </Text>
          <Text className="text-text font-display text-4xl">
            {platform.name}
          </Text>
          <Text className="text-muted">
            Link your {platform.name} account so GAMED can pull your matches and
            track your progress across every session.
          </Text>
        </View>

        <View className="bg-card border border-border rounded-3xl p-5 gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-text font-semibold">Simulate failure</Text>
              <Text className="text-muted text-xs">
                Server will return 500 so you can verify rollback.
              </Text>
            </View>
            <Switch
              value={simulateFailure}
              onValueChange={setSimulateFailure}
              trackColor={{ false: "#26263A", true: "#7C5CFF" }}
              thumbColor="#F4F4F6"
            />
          </View>
        </View>

        {platform.connected ? (
          <View className="bg-card border border-border rounded-3xl p-4">
            <Text className="text-success">
              {platform.name} is already connected.
            </Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View className="bg-card border border-danger rounded-2xl p-4 gap-1">
            <Text className="text-danger font-semibold">Connection failed</Text>
            <Text className="text-muted text-sm">{errorMessage}</Text>
          </View>
        ) : null}

        <View className="gap-3 mt-auto pb-2">
          <Button
            label={
              platform.connected
                ? "Already connected"
                : mutation.isPending
                  ? "Connecting…"
                  : "Connect"
            }
            onPress={onConnect}
            loading={mutation.isPending}
            disabled={mutation.isPending || platform.connected}
          />
          <Button
            label="Cancel"
            variant="ghost"
            onPress={() => router.back()}
            disabled={mutation.isPending}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
