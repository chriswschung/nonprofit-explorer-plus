import wave
import struct
import numpy as np

SAMPLE_RATE = 44100
BPM = 88.0
BEAT_DUR = 60.0 / BPM
BAR_DUR = BEAT_DUR * 4
TOTAL_BARS = 18
TOTAL_DURATION = TOTAL_BARS * BAR_DUR
NUM_SAMPLES = int(SAMPLE_RATE * TOTAL_DURATION)

print(f"Generating Fast Upbeat Lo-Fi Track: {TOTAL_DURATION:.1f}s...")

t = np.linspace(0, TOTAL_DURATION, NUM_SAMPLES, endpoint=False)
left = np.zeros(NUM_SAMPLES, dtype=np.float32)
right = np.zeros(NUM_SAMPLES, dtype=np.float32)

notes = {'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
         'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
         'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00}

chords = [
    {'root': 'C3', 'freqs': [notes['C4'], notes['E4'], notes['G4'], notes['B4'], notes['E5']]},
    {'root': 'A3', 'freqs': [notes['A3'], notes['C4'], notes['E4'], notes['G4'], notes['C5']]},
    {'root': 'D3', 'freqs': [notes['D4'], notes['F4'], notes['A4'], notes['C5'], notes['F5']]},
    {'root': 'G3', 'freqs': [notes['G3'], notes['B3'], notes['D4'], notes['F4'], notes['E5']]}
]

# Chords
for bar in range(TOTAL_BARS):
    c_idx = bar % len(chords)
    chord = chords[c_idx]
    bar_start_t = bar * BAR_DUR
    
    for beat_off, vol in [(0.0, 1.0), (2.5, 0.65)]:
        hit_t0 = bar_start_t + beat_off * BEAT_DUR
        hit_mask = (t >= hit_t0) & (t < hit_t0 + BAR_DUR * 1.5)
        dt = t[hit_mask] - hit_t0
        
        env = np.exp(-dt / 1.1) * vol
        tremolo = 1.0 + 0.1 * np.sin(2 * np.pi * 5.0 * dt)
        
        for f in chord['freqs']:
            sig = (0.5 * np.sin(2 * np.pi * f * dt) + 
                   0.25 * np.sin(2 * np.pi * f * 2 * dt) * np.exp(-dt * 2) +
                   0.15 * np.sin(2 * np.pi * f * 3 * dt) * np.exp(-dt * 4)) * env * tremolo * 0.08
            
            left[hit_mask] += sig * 0.5
            right[hit_mask] += sig * 0.5

# Bass
for bar in range(TOTAL_BARS):
    c_idx = bar % len(chords)
    root_f = notes[chords[c_idx]['root']] / 2.0
    bar_start_t = bar * BAR_DUR
    
    for b_beat, b_vol, b_len in [(0.0, 1.0, 2.0), (2.0, 0.7, 1.0), (3.0, 0.8, 1.0)]:
        hit_t0 = bar_start_t + b_beat * BEAT_DUR
        hit_mask = (t >= hit_t0) & (t < hit_t0 + b_len * BEAT_DUR)
        dt = t[hit_mask] - hit_t0
        
        env = np.exp(-dt / 0.8) * b_vol
        sub = (0.85 * np.sin(2 * np.pi * root_f * dt) + 0.15 * np.sin(2 * np.pi * root_f * 2 * dt)) * env * 0.22
        
        left[hit_mask] += sub
        right[hit_mask] += sub

# Drums
for bar in range(TOTAL_BARS):
    bar_start_t = bar * BAR_DUR
    
    # Kicks
    for k_beat in [0.0, 2.5, 3.25]:
        kt0 = bar_start_t + k_beat * BEAT_DUR
        kmask = (t >= kt0) & (t < kt0 + 0.22)
        dt = t[kmask] - kt0
        freq = 130 * np.exp(-dt * 35) + 45
        env = np.exp(-dt * 20)
        kick = np.sin(2 * np.pi * freq * dt) * env * 0.4
        left[kmask] += kick
        right[kmask] += kick

    # Snares
    for s_beat in [1.0, 3.0]:
        st0 = bar_start_t + s_beat * BEAT_DUR
        smask = (t >= st0) & (t < st0 + 0.18)
        dt = t[smask] - st0
        tone = np.sin(2 * np.pi * 180 * dt) * np.exp(-dt * 30) * 0.18
        noise = np.random.uniform(-1, 1, len(dt)) * np.exp(-dt * 22) * 0.22
        snare = tone + noise
        left[smask] += snare
        right[smask] += snare

    # Hihats
    for h in range(8):
        ht0 = bar_start_t + h * 0.5 * BEAT_DUR
        hmask = (t >= ht0) & (t < ht0 + 0.08)
        dt = t[hmask] - ht0
        vol = 0.18 if h % 2 == 0 else 0.12
        hihat = np.random.uniform(-1, 1, len(dt)) * np.exp(-dt * 60) * vol
        left[hmask] += hihat * 0.7
        right[hmask] += hihat * 0.9

# Vinyl crackle
np.random.seed(42)
pops = (np.random.rand(NUM_SAMPLES) < 0.0012).astype(np.float32) * np.random.uniform(-0.06, 0.06, NUM_SAMPLES)
left += pops + np.random.uniform(-0.002, 0.002, NUM_SAMPLES)
right += pops + np.random.uniform(-0.002, 0.002, NUM_SAMPLES)

# Normalization
max_v = max(np.max(np.abs(left)), np.max(np.abs(right)))
left = (left / max_v * 0.85 * 32767).astype(np.int16)
right = (right / max_v * 0.85 * 32767).astype(np.int16)

stereo = np.empty((NUM_SAMPLES * 2,), dtype=np.int16)
stereo[0::2] = left
stereo[1::2] = right

wav_file = wave.open("lofi_upbeat_beat.wav", "wb")
wav_file.setnchannels(2)
wav_file.setsampwidth(2)
wav_file.setframerate(SAMPLE_RATE)
wav_file.writeframes(stereo.tobytes())
wav_file.close()

print("Successfully generated 'lofi_upbeat_beat.wav' instantly!")
