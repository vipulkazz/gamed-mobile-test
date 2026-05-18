import { ActivityIndicator, Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
};

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: Props) {
  const isDisabled = disabled || loading;

  const base = "rounded-2xl py-4 px-6 items-center justify-center flex-row";
  const variants = {
    primary: isDisabled ? "bg-accentSoft opacity-60" : "bg-accent",
    ghost: isDisabled
      ? "bg-transparent border border-border opacity-60"
      : "bg-transparent border border-border",
    danger: isDisabled ? "bg-danger opacity-60" : "bg-danger",
  } as const;

  const textClass =
    variant === "ghost" ? "text-text font-semibold" : "text-white font-semibold";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`${base} ${variants[variant]}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "ghost" ? "#F4F4F6" : "#fff"} />
      ) : (
        <Text className={textClass}>{label}</Text>
      )}
    </Pressable>
  );
}
