import { useEffect, useMemo } from "react";
import { View } from "react-native";
import {
  Canvas,
  Group,
  Path,
  Skia,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { PLATFORM_BRANDS } from "@/src/lib/platformLogos";
import { PlatformId } from "@/src/types";

type Props = {
  id: PlatformId;
  size?: number;
  connected: boolean;
};

const PADDING_FRACTION = 0.18; // breathing room inside the avatar tile

export function PlatformLogo({ id, size = 40, connected }: Props) {
  const brand = PLATFORM_BRANDS[id];

  // Connected: gentle continuous breathe. Unconnected: stronger pulse to
  // invite the tap.
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, {
        duration: connected ? 3200 : 2200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [t, connected]);

  const skPath = useMemo(() => {
    const p = Skia.Path.MakeFromSVGString(brand.path);
    return p ?? Skia.Path.Make();
  }, [brand.path]);

  const innerSize = size * (1 - PADDING_FRACTION * 2);
  const scale = innerSize / brand.viewBox;
  const offset = (size - innerSize) / 2;

  const breatheTransform = useDerivedValue(() => {
    const amp = connected ? 0.02 : 0.04;
    const s = 1 + Math.sin(t.value * Math.PI) * amp;
    return [
      { translateX: size / 2 },
      { translateY: size / 2 },
      { scale: s },
      { translateX: -size / 2 },
      { translateY: -size / 2 },
    ];
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: brand.bg,
        overflow: "hidden",
      }}
    >
      <Canvas
        opaque={false}
        style={{
          width: size,
          height: size,
          backgroundColor: "transparent",
        }}
      >
        <Group transform={breatheTransform}>
          <Group transform={[{ translateX: offset }, { translateY: offset }, { scale }]}>
            <Path path={skPath} color={brand.color} opacity={connected ? 1 : 0.75} />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
}
