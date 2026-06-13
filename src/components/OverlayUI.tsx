import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

interface OverlayUIProps {
  score: number;
  combo: number;
  shields: number;
}

export const OverlayUI: React.FC<OverlayUIProps> = ({ score, combo, shields }) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  return (
    <View style={styles.bar}>
      {/* Score */}
      <View style={styles.scoreBlock}>
        <Text style={[styles.scoreValue, isSmall && styles.scoreSmall]}>{score}</Text>
        <Text style={styles.label}>SCORE</Text>
      </View>

      {/* Combo */}
      <View style={styles.center}>
        {combo >= 2 && (
          <>
            <Text style={[styles.comboValue, isSmall && styles.comboSmall]}>{combo}×</Text>
            <Text style={styles.comboLabel}>COMBO</Text>
          </>
        )}
      </View>

      {/* Shields */}
      <View style={styles.shieldPill}>
        <Text style={styles.shieldEmoji}>🛡</Text>
        <Text style={styles.shieldNum}>{shields}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(11,12,16,0.85)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(102,252,241,0.15)',
    zIndex: 20,
  },
  scoreBlock: { alignItems: 'flex-start' },
  scoreValue: {
    color: '#66FCF1',
    fontSize: 30,
    fontWeight: '900',
    textShadowColor: '#45A29E',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  scoreSmall: { fontSize: 22 },
  label: {
    color: 'rgba(198,230,230,0.5)',
    fontSize: 9,
    letterSpacing: 3,
    fontWeight: '700',
  },
  center: { alignItems: 'center', minWidth: 50 },
  comboValue: {
    color: '#F1C40F',
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    textShadowColor: '#F1C40F',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  comboSmall: { fontSize: 18 },
  comboLabel: {
    color: 'rgba(241,196,15,0.6)',
    fontSize: 8,
    letterSpacing: 3,
    fontWeight: '700',
  },
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(241,196,15,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(241,196,15,0.4)',
  },
  shieldEmoji: { fontSize: 14 },
  shieldNum: {
    color: '#F1C40F',
    fontSize: 16,
    fontWeight: '900',
  },
});
