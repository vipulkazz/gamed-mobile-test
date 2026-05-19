import { useEffect } from "react";
import { Text, View } from "react-native";
import {
  BlurMask,
  Canvas,
  Path,
  Skia,
  SweepGradient,
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
  /** 0–100, the percentile of the score globally */
  percentile: number;
  score: number;
  size?: number;
};

const STROKE = 10;
const GLOW_PADDING = 70;

export function GigiScoreRing({ percentile, score, size = 210 }: Props) {
  const fill = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(Math.min(percentile / 100, 1), {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });
    rotate.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [percentile, fill, rotate]);

  const canvasSize = size + GLOW_PADDING * 2;
  const radius = (size - STROKE) / 2;
  const ringCenter = canvasSize / 2;

  const ringPath = Skia.Path.Make();
  ringPath.addCircle(ringCenter, ringCenter, radius);

  const start = useDerivedValue(() => 0);
  const end = useDerivedValue(() => fill.value);
  const transform = useDerivedValue(() => [
    { rotate: rotate.value * Math.PI * 2 },
  ]);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas
        opaque={false}
        style={{
          position: "absolute",
          width: canvasSize,
          height: canvasSize,
          left: -GLOW_PADDING,
          top: -GLOW_PADDING,
          backgroundColor: "transparent",
        }}
      >
        {/* Faint track — almost invisible, just hinting at the full circle */}
        <Path
          path={ringPath}
          color="#FFFFFF"
          style="stroke"
          strokeWidth={STROKE}
          strokeCap="round"
          opacity={0.06}
        />
        {/* Single progress arc with soft inherent glow via BlurMask */}
        <Path
          path={ringPath}
          style="stroke"
          strokeWidth={STROKE}
          strokeCap="round"
          start={start}
          end={end}
          origin={vec(ringCenter, ringCenter)}
          transform={transform}
        >
          <BlurMask blur={4} style="solid" />
          <SweepGradient
            c={vec(ringCenter, ringCenter)}
            colors={["#FF5C7A", "#7C5CFF", "#3DDC97", "#FFD166", "#FF5C7A"]}
          />
        </Path>
      </Canvas>

      <View className="items-center gap-1">
        <Text className="text-text/50 text-[10px] uppercase tracking-[3px]">
          GIGI
        </Text>
        <Text className="text-text font-display text-5xl">{score}</Text>
        <Text className="text-success text-xs">
          Top {(100 - percentile).toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}
