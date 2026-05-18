import { Pressable, Text, View } from "react-native";
import { Platform } from "@/src/types";

type Props = {
  platform: Platform;
  onPress?: () => void;
};

const ICON: Record<string, string> = {
  steam: "ST",
  epic: "EP",
  playstation: "PS",
  xbox: "XB",
};

export function PlatformRow({ platform, onPress }: Props) {
  const tappable = !platform.connected && !!onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={!tappable}
      className="flex-row items-center justify-between bg-card rounded-2xl px-4 py-4 border border-border"
    >
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-xl bg-surface items-center justify-center">
          <Text className="text-text font-display">{ICON[platform.id]}</Text>
        </View>
        <Text className="text-text font-semibold text-base">{platform.name}</Text>
      </View>
      {platform.connected ? (
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-success" />
          <Text className="text-success text-sm">Connected</Text>
        </View>
      ) : (
        <Text className="text-accent text-sm font-semibold">Connect →</Text>
      )}
    </Pressable>
  );
}
