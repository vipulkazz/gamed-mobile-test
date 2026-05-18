import { Text, View } from "react-native";
import { Button } from "./Button";

type Props = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <Text className="text-text font-display text-xl">{title}</Text>
      <Text className="text-muted text-center">{message}</Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} /> : null}
    </View>
  );
}
