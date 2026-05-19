import { Pressable, Text, View } from "react-native";
import { GlassCard } from "@/src/components/skia/GlassCard";
import { PlatformLogo } from "@/src/components/skia/PlatformLogo";
import { Platform } from "@/src/types";

type Props = {
  platform: Platform;
  onPress?: () => void;
};

export function PlatformRow({ platform, onPress }: Props) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <GlassCard radius={18}>
        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-row items-center gap-3">
            <PlatformLogo
              id={platform.id}
              connected={platform.connected}
              size={40}
            />
            <Text className="text-text font-semibold text-base">
              {platform.name}
            </Text>
          </View>
          {platform.connected ? (
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-success" />
              <Text className="text-success text-sm font-medium">Connected</Text>
            </View>
          ) : (
            <Text className="text-accent text-sm font-semibold">Connect →</Text>
          )}
        </View>
      </GlassCard>
    </Pressable>
  );
}
