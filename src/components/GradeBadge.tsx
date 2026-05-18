import { Text, View } from "react-native";
import { SessionGrade } from "@/src/types";

const COLORS: Record<SessionGrade, string> = {
  S: "bg-gradeS",
  A: "bg-gradeA",
  B: "bg-gradeB",
  C: "bg-gradeC",
  D: "bg-gradeD",
};

export function GradeBadge({ grade }: { grade: SessionGrade }) {
  return (
    <View
      className={`${COLORS[grade]} w-9 h-9 rounded-xl items-center justify-center`}
    >
      <Text className="text-bg font-display text-lg">{grade}</Text>
    </View>
  );
}
