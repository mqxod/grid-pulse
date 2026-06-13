import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Board } from './src/components/Board';
import { OverlayUI } from './src/components/OverlayUI';
import { GameOverModal } from './src/components/GameOverModal';
import { AdBanner } from './src/components/AdBanner';
import { StartOverlay } from './src/components/StartOverlay';
import { useGameEngine } from './src/hooks/useGameEngine';
import { useAudio } from './src/hooks/useAudio';

function Game() {
  const insets = useSafeAreaInsets();
  const { gameState, handleTap, restartGame, revivePlayer, setBoardHeight } = useGameEngine();
  const { playTap, playMiss } = useAudio();
  const prevGameOver = useRef(gameState.isGameOver);

  useEffect(() => {
    if (gameState.isGameOver && !prevGameOver.current) {
      playMiss();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
    prevGameOver.current = gameState.isGameOver;
  }, [gameState.isGameOver, playMiss]);

  const onTapLane = useCallback(
    (lane: number) => {
      const hit = handleTap(lane);
      if (hit) {
        playTap();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    },
    [handleTap, playTap],
  );

  const onStartTap = useCallback(() => {
    handleTap(0); // any lane → triggers isStarted
  }, [handleTap]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0C10" />

      {/* HUD bar (normal flex, not absolute) */}
      <OverlayUI score={gameState.score} combo={gameState.combo} shields={gameState.shields} />

      {/* Board fills remaining space */}
      <View style={styles.boardWrap}>
        <Board tiles={gameState.tiles} onTapLane={onTapLane} onBoardLayout={setBoardHeight} />

        {/* Start overlay (sits on top of the board) */}
        <StartOverlay isStarted={gameState.isStarted} onTap={onStartTap} />
      </View>

      {/* Ad banner */}
      <AdBanner />
      {/* Bottom safe-area spacer */}
      <View style={{ height: insets.bottom, backgroundColor: '#08090C' }} />

      {/* Game-over modal */}
      <GameOverModal
        visible={gameState.isGameOver}
        score={gameState.score}
        onRestart={restartGame}
        onRevive={revivePlayer}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Game />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0C10',
  },
  boardWrap: {
    flex: 1,
    position: 'relative',
  },
});
