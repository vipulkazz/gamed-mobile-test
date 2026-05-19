import { Text, View } from "react-native";
import { GlassCard } from "@/src/components/skia/GlassCard";
import { Session, SessionGrade } from "@/src/types";
import { GradeBadge } from "./GradeBadge";

const GRADE_BAR: Record<SessionGrade, string> = {
  S: "#FFD166",
  A: "#3DDC97",
  B: "#7C5CFF",
  C: "#FF9F1C",
  D: "#FF5C7A",
};

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
    <GlassCard radius={18}>
      <View className="flex-row items-stretch">
        {/* Grade-coloured edge bar for quick scanning */}
        <View
          style={{ backgroundColor: GRADE_BAR[session.grade], width: 4 }}
        />
        <View className="flex-1 flex-row items-center justify-between px-4 py-4">
          <View className="flex-1 gap-1 pr-3">
            <Text
              className="text-text font-semibold text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {session.game}
            </Text>
            <Text className="text-muted text-xs">
              {formatDate(session.playedAt)}
            </Text>
          </View>
          <View className="items-center gap-0.5 mr-3">
            <Text className="text-muted text-[10px] uppercase tracking-widest">
              APM
            </Text>
            <Text className="text-text font-display text-lg">{session.apm}</Text>
          </View>
          <GradeBadge grade={session.grade} />
        </View>
      </View>
    </GlassCard>
  );
}
