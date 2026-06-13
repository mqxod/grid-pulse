import React, { useEffect, memo } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { TileData, TileType } from '../engine/types';
import { TILE_H, HOLD_TILE_H } from '../hooks/useGameEngine';

interface TileProps {
  tile: TileData;
  boardHeight: number;
  onTap: () => void;
}

const COLORS: Record<TileType, string> = {
  [TileType.BLUE]:  '#66FCF1',
  [TileType.GREEN]: '#39FF14',
  [TileType.GOLD]:  '#F1C40F',
};

const LABELS: Record<TileType, string> = {
  [TileType.BLUE]:  '',
  [TileType.GREEN]: 'HOLD',
  [TileType.GOLD]:  '🛡',
};

const TileComponent: React.FC<TileProps> = ({ tile, boardHeight, onTap }) => {
  const hFrac = tile.type === TileType.GREEN ? HOLD_TILE_H : TILE_H;
  const tileH = boardHeight * hFrac;
  const totalTravel = boardHeight + tileH; // -tileH → boardHeight

  const y = useSharedValue(-tileH);

  useEffect(() => {
    const elapsed = Date.now() - tile.spawnTime;
    const remaining = Math.max(tile.fallDuration - elapsed, 0);

    // Jump to current position
    const startFrac = Math.min(elapsed / tile.fallDuration, 1);
    y.value = startFrac * totalTravel - tileH;

    // Animate the rest
    if (remaining > 0) {
      y.value = withTiming(boardHeight, {
        duration: remaining,
        easing: Easing.linear,
      });
    }

    return () => cancelAnimation(y);
    // Only run once when tile mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    height: tileH - 4,
  }));

  const color = COLORS[tile.type];
  const label = LABELS[tile.type];

  // We use Pressable inside Animated.View to catch touches on the exact moving object
  return (
    <Animated.View
      style={[
        styles.tile,
        style,
        { backgroundColor: color, borderColor: color, shadowColor: color },
      ]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPressIn={onTap} />
      {label !== '' && <Text style={styles.label} pointerEvents="none">{label}</Text>}
    </Animated.View>
  );
};

// Memo: tile props never change after mount (id is stable, hit tiles are filtered out).
export const Tile = memo(TileComponent, (prev, next) => prev.tile.id === next.tile.id);

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    top: 0,
    left: 3,
    right: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    color: '#0B0C10',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
