import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  BlurMask,
  Canvas,
  Circle,
  Fill,
  Group,
  Line,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  width: number;
  height: number;
};

/**
 * Slowly drifting coloured orbs behind a subtle tech grid. Each orb traces
 * its own elliptical path on a different period so the composition never
 * repeats exactly. Built for glassmorphism layers to sit on top of.
 */
export function AnimatedHeroBackground({ width, height }: Props) {
  const t1 = useSharedValue(0);
  const t2 = useSharedValue(0);
  const t3 = useSharedValue(0);

  useEffect(() => {
    t1.value = withRepeat(
      withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    t2.value = withRepeat(
      withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    t3.value = withRepeat(
      withTiming(1, { duration: 17000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [t1, t2, t3]);

  const cx = width / 2;
  const cy = height * 0.55;

  // Three orbs, each elliptical motion with its own phase and amplitude.
  const orb1X = useDerivedValue(
    () => cx + Math.cos(t1.value * Math.PI * 2) * width * 0.35,
  );
  const orb1Y = useDerivedValue(
    () => cy + Math.sin(t1.value * Math.PI * 2) * height * 0.18,
  );
  const orb2X = useDerivedValue(
    () => cx + Math.cos(t2.value * Math.PI * 2 + 1.7) * width * 0.45,
  );
  const orb2Y = useDerivedValue(
    () => cy + Math.sin(t2.value * Math.PI * 2 + 1.7) * height * 0.22,
  );
  const orb3X = useDerivedValue(
    () => cx + Math.cos(t3.value * Math.PI * 2 + 3.1) * width * 0.3,
  );
  const orb3Y = useDerivedValue(
    () => cy + Math.sin(t3.value * Math.PI * 2 + 3.1) * height * 0.25,
  );

  const gridSpacing = 36;
  const gridLines = Math.ceil(height / gridSpacing);

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { width, height }]}
    >
      <Canvas style={{ flex: 1 }}>
        {/* Near-black base */}
        <Fill color="#0B0B0F" />

        {/* Soft radial vignette under the ring area for depth */}
        <Fill opacity={0.6}>
          <RadialGradient
            c={vec(cx, cy)}
            r={width * 0.85}
            colors={["#1B1535", "#0B0B0F"]}
          />
        </Fill>

        {/* Three drifting orbs with heavy blur */}
        <Group>
          <Circle cx={orb1X} cy={orb1Y} r={140} color="#7C5CFF" opacity={0.55}>
            <BlurMask blur={90} style="normal" />
          </Circle>
          <Circle cx={orb2X} cy={orb2Y} r={120} color="#FF5C7A" opacity={0.4}>
            <BlurMask blur={90} style="normal" />
          </Circle>
          <Circle cx={orb3X} cy={orb3Y} r={160} color="#3DDC97" opacity={0.28}>
            <BlurMask blur={110} style="normal" />
          </Circle>
        </Group>

        {/* Subtle horizontal tech grid */}
        <Group opacity={0.06}>
          {Array.from({ length: gridLines }).map((_, i) => (
            <Line
              key={i}
              p1={vec(0, i * gridSpacing + 0.5)}
              p2={vec(width, i * gridSpacing + 0.5)}
              color="#FFFFFF"
              strokeWidth={1}
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}
