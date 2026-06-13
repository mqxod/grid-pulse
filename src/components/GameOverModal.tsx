import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';

interface Props {
  visible: boolean;
  score: number;
  onRestart: () => void;
  onRevive: () => void;
}

export const GameOverModal: React.FC<Props> = ({ visible, score, onRestart, onRevive }) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.84, 360);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.card, { width: cardWidth }]}>
          <View style={styles.topStripe} />

          <Text style={styles.title}>SYSTEM FAILURE</Text>
          <Text style={styles.sub}>Connection lost to the grid</Text>

          <View style={styles.hr} />

          <Text style={styles.scoreLabel}>FINAL SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>

          <View style={styles.hr} />

          <TouchableOpacity style={styles.reviveBtn} onPress={onRevive} activeOpacity={0.7}>
            <Text style={styles.reviveText}>▶  WATCH AD TO REVIVE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restartBtn} onPress={onRestart} activeOpacity={0.7}>
            <Text style={styles.restartText}>↺  RESTART</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11,12,16,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#13171E',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#45A29E',
    paddingBottom: 26,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#66FCF1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 14,
  },
  topStripe: { width: '100%', height: 4, backgroundColor: '#45A29E', marginBottom: 26 },
  title: { color: '#FF4060', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  sub: { color: 'rgba(198,230,230,0.45)', fontSize: 11, marginTop: 4, letterSpacing: 1 },
  hr: { width: '85%', height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(102,252,241,0.18)', marginVertical: 18 },
  scoreLabel: { color: 'rgba(198,230,230,0.5)', fontSize: 10, letterSpacing: 3, fontWeight: '700' },
  scoreValue: {
    color: '#66FCF1',
    fontSize: 48,
    fontWeight: '900',
    marginTop: 2,
    textShadowColor: '#45A29E',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  reviveBtn: {
    backgroundColor: 'rgba(102,252,241,0.1)',
    borderWidth: 1.5,
    borderColor: '#66FCF1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviveText: { color: '#66FCF1', fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  restartBtn: { paddingVertical: 12, width: '85%', alignItems: 'center' },
  restartText: { color: 'rgba(198,230,230,0.55)', fontSize: 13, letterSpacing: 1 },
});
