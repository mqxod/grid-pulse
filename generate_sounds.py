import wave
import struct
import math
import os

os.makedirs('assets/sounds', exist_ok=True)

def generate_tone(filename, base_freq, duration_sec, volume=0.5, is_sweep=False, sweep_to=None):
    sample_rate = 44100
    n_samples = int(sample_rate * duration_sec)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(n_samples):
            t = float(i) / sample_rate
            
            # Fast attack, exponential decay envelope
            env = max(0, math.exp(-t * 15)) if not is_sweep else max(0, 1.0 - (t / duration_sec))
            
            if is_sweep and sweep_to is not None:
                current_freq = base_freq + (sweep_to - base_freq) * (t/duration_sec)
            else:
                current_freq = base_freq
                
            # Synthesize a synth-like square/sine mix
            sine = math.sin(2.0 * math.pi * current_freq * t)
            square = 1.0 if sine > 0 else -1.0
            value = (sine * 0.7 + square * 0.3) * volume * env
            
            # clipping
            value = max(-1.0, min(1.0, value))
            data = struct.pack('<h', int(value * 32767.0))
            wav_file.writeframesraw(data)

# Tap: Bright synth beep (E6)
generate_tone('assets/sounds/tap.wav', 1318.51, 0.1, volume=0.4)

# Miss: Deep error synth swoop down
generate_tone('assets/sounds/miss.wav', 250.0, 0.35, volume=0.5, is_sweep=True, sweep_to=50.0)

print("Sounds generated!")
