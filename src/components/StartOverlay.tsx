import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface Props {
  isStarted: boolean;
  onTap: () => void;
}

export const StartOverlay: React.FC<Props> = ({ isStarted, onTap }) => {
  if (isStarted) return null;

  return (
    <Pressable style={styles.overlay} onPress={onTap}>
      <Text style={styles.title}>GROD PULSE</Text>
      <Text style={styles.subtitle}>SYNTH RHYTHM</Text>
      <View style={styles.divider} />
      <Text style={styles.tapText}>TAP TO START</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,12,16,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  title: {
    color: '#66FCF1',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: '#66FCF1',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    color: '#45A29E',
    fontSize: 14,
    letterSpacing: 6,
    fontWeight: '700',
    marginTop: 4,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#45A29E',
    marginVertical: 30,
    borderRadius: 1,
  },
  tapText: {
    color: 'rgba(198,230,230,0.5)',
    fontSize: 14,
    letterSpacing: 3,
    fontWeight: '600',
  },
});
