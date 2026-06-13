import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import { TileData } from '../engine/types';
import { Tile } from './Tile';
import { HIT_TOP, HIT_BOT } from '../hooks/useGameEngine';

interface BoardProps {
  tiles: TileData[];
  onTapLane: (lane: number) => void;
  onBoardLayout: (height: number) => void;
}

const LANES = [0, 1, 2, 3];

export const Board: React.FC<BoardProps> = ({ tiles, onTapLane, onBoardLayout }) => {
  // useState (not useRef) so the component re-renders when layout is measured.
  const [boardHeight, setBoardHeight] = useState(0);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      setBoardHeight(h);
      onBoardLayout(h);
    },
    [onBoardLayout],
  );

  const hitZoneTop = boardHeight * HIT_TOP;
  const hitZoneHeight = boardHeight * (HIT_BOT - HIT_TOP);

  return (
    <View style={styles.root} onLayout={handleLayout}>
      {/* Lane dividers (non-interactive) */}
      <View style={styles.gridLines} pointerEvents="none">
        {LANES.map(i => (
          <View key={`div-${i}`} style={styles.divider} />
        ))}
      </View>



      {/* 4 Lanes */}
      <View style={styles.lanesRow}>
        {LANES.map(lane => (
          <View
            key={`lane-${lane}`}
            style={styles.lane}
          >
            {boardHeight > 0 &&
              tiles
                .filter(t => t.lane === lane && !t.hit)
                .map(t => (
                  <Tile
                    key={t.id}
                    tile={t}
                    boardHeight={boardHeight}
                    onTap={() => onTapLane(lane)}
                  />
                ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0C10',
    overflow: 'hidden',
  },
  gridLines: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  divider: {
    flex: 1,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(102, 252, 241, 0.18)',
  },
  hitZone: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(102, 252, 241, 0.06)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'rgba(102, 252, 241, 0.4)',
  },
  lanesRow: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  lane: {
    flex: 1,
  },
});
