import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function Field({ label, error, ...inputProps }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-muted text-xs uppercase tracking-widest">{label}</Text>
      <TextInput
        placeholderTextColor="#5A5A6E"
        {...inputProps}
        className={`rounded-2xl bg-card text-text px-4 py-4 border ${
          error ? "border-danger" : "border-border"
        }`}
      />
      {error ? <Text className="text-danger text-sm">{error}</Text> : null}
    </View>
  );
}
