import { Text, View } from "react-native";
import { Session } from "@/src/types";
import { GradeBadge } from "./GradeBadge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function SessionCard({ session }: { session: Session }) {
  return (
    <View className="bg-card rounded-2xl px-4 py-4 border border-border flex-row items-center justify-between">
      <View className="flex-1 gap-1 pr-3">
        <Text
          className="text-text font-semibold text-base"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {session.game}
        </Text>
        <Text className="text-muted text-xs">{formatDate(session.playedAt)}</Text>
      </View>
      <View className="items-center gap-1 mr-3">
        <Text className="text-muted text-xs uppercase tracking-widest">APM</Text>
        <Text className="text-text font-display text-base">{session.apm}</Text>
      </View>
      <GradeBadge grade={session.grade} />
    </View>
  );
}
