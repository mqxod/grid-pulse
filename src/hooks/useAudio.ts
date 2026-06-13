import { useAudioPlayer } from 'expo-audio';

export function useAudio() {
  const tapSound = useAudioPlayer(require('../../assets/sounds/tap.wav'));
  const missSound = useAudioPlayer(require('../../assets/sounds/miss.wav'));

  const playTap = () => {
    try {
      tapSound.seekTo(0);
      tapSound.play();
    } catch {}
  };

  const playMiss = () => {
    try {
      missSound.seekTo(0);
      missSound.play();
    } catch {}
  };

  return { playTap, playMiss };
}
