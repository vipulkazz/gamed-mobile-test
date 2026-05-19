import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import {
  BackdropFilter,
  Blur,
  Canvas,
  Fill,
} from "@shopify/react-native-skia";

type Props = ViewProps & {
  children: ReactNode;
  radius?: number;
  blur?: number;
  /** rgba tint applied over the blurred backdrop */
  tint?: string;
  /** rgba border colour drawn 1px inside the rounded shape */
  border?: string;
};

/**
 * Skia-powered glassmorphism. The Canvas sits absolutely behind the children,
 * blurs whatever the parent layout has placed beneath it (typically the
 * animated orbs in the hero background), and a thin tint pass keeps content
 * readable on top.
 */
export function GlassCard({
  children,
  radius = 20,
  blur = 24,
  tint = "rgba(20, 20, 30, 0.45)",
  border = "rgba(255, 255, 255, 0.08)",
  style,
  ...rest
}: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          borderRadius: radius,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: border,
        },
        style,
      ]}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <BackdropFilter filter={<Blur blur={blur} />}>
          <Fill color={tint} />
        </BackdropFilter>
      </Canvas>
      {children}
    </View>
  );
}
