import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Canvas, Group, RoundedRect } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Particle = {
  id: number;
  x: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  delay: number;
};

const COLORS = ["#7C5CFF", "#FF5C7A", "#3DDC97", "#FFD166", "#FF9F1C", "#A78BFA"];
const PARTICLE_COUNT = 60;

function makeParticles(screenWidth: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
    id: i,
    // Spread evenly across the full width with a small random jitter
    x: Math.random() * screenWidth,
    // Subtle sideways drift so they don't fall in straight lines
    vx: (Math.random() - 0.5) * 140,
    // Mostly fall straight down, slight initial downward push
    vy: 80 + Math.random() * 120,
    size: 6 + Math.random() * 6,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * Math.PI * 4,
    color: COLORS[i % COLORS.length] as string,
    delay: Math.random() * 250,
  }));
}

type Props = {
  /** Increment this number each time a new burst should fire */
  trigger: number;
};

export function ConfettiBurst({ trigger }: Props) {
  const { width, height } = Dimensions.get("window");
  const [particles, setParticles] = useState<Particle[]>([]);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    setParticles(makeParticles(width));
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 2400,
      easing: Easing.linear,
    });
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [trigger, width, progress]);

  if (particles.length === 0) return null;

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { width, height }]}
    >
      <Canvas style={{ flex: 1 }}>
        <Group>
          {particles.map((p) => (
            <ConfettiParticle
              key={p.id}
              particle={p}
              progress={progress}
              screenHeight={height}
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

function ConfettiParticle({
  particle,
  progress,
  screenHeight,
}: {
  particle: Particle;
  progress: ReturnType<typeof useSharedValue<number>>;
  screenHeight: number;
}) {
  const GRAVITY = 600;
  const TOTAL_DURATION_S = 2.4;

  // Time the particle has been "alive", in seconds, accounting for stagger delay.
  const elapsed = useDerivedValue(() => {
    const t = progress.value * TOTAL_DURATION_S - particle.delay / 1000;
    return Math.max(0, t);
  });

  const x = useDerivedValue(() => particle.x + particle.vx * elapsed.value);
  const y = useDerivedValue(
    () => -20 + particle.vy * elapsed.value + 0.5 * GRAVITY * elapsed.value ** 2,
  );

  // Fade in quickly, hold, then fade as it nears the bottom
  const opacity = useDerivedValue(() => {
    const t = progress.value;
    if (t < 0.05) return t / 0.05;
    if (t > 0.85) return Math.max(0, (1 - t) / 0.15);
    return 1;
  });

  // Render as a small rotating rounded rect (paper-like)
  const transform = useDerivedValue(() => [
    { translateX: x.value },
    { translateY: y.value },
    { rotate: particle.rotation + particle.rotationSpeed * elapsed.value },
  ]);

  // Hide once below the screen to save fillrate
  const visible = useDerivedValue(() => (y.value < screenHeight + 40 ? 1 : 0));
  const effectiveOpacity = useDerivedValue(() => opacity.value * visible.value);

  return (
    <Group transform={transform} opacity={effectiveOpacity}>
      <RoundedRect
        x={-particle.size / 2}
        y={-particle.size / 4}
        width={particle.size}
        height={particle.size * 0.5}
        r={1.5}
        color={particle.color}
      />
    </Group>
  );
}
