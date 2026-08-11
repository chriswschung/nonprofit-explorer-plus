import wave
import math
import struct
import random

# Audio specifications
SAMPLE_RATE = 44100
BPM = 88.0
BEAT_DUR = 60.0 / BPM  # ~0.6818 seconds per beat
BAR_DUR = BEAT_DUR * 4  # ~2.727 seconds per bar
TOTAL_BARS = 18         # ~49 seconds total
TOTAL_DURATION = TOTAL_BARS * BAR_DUR
NUM_SAMPLES = int(SAMPLE_RATE * TOTAL_DURATION)

print(f"Generating Upbeat Lo-Fi Track: {TOTAL_DURATION:.1f}s, {NUM_SAMPLES} samples...")

# Note frequencies (Hz)
def note_freq(name):
    notes = {'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
             'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
             'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00}
    return notes.get(name, 440.0)

# Chord definitions (Rhodes / E-Piano voicing)
chords = [
    # Cmaj7
    {'root': 'C3', 'notes': ['C4', 'E4', 'G4', 'B4', 'E5']},
    # Am7
    {'root': 'A3', 'notes': ['A3', 'C4', 'E4', 'G4', 'C5']},
    # Dm7
    {'root': 'D3', 'notes': ['D4', 'F4', 'A4', 'C5', 'F5']},
    # G7 / G13
    {'root': 'G3', 'notes': ['G3', 'B3', 'D4', 'F4', 'E5']}
]

# Generate stereo audio buffer
left_channel = [0.0] * NUM_SAMPLES
right_channel = [0.0] * NUM_SAMPLES

# Set random seed for consistent organic feel
random.seed(42)

# 1. Synthesize Chord Progressions (Warm E-Piano sound with soft decay & tremolo)
for bar in range(TOTAL_BARS):
    chord_idx = bar % len(chords)
    chord = chords[chord_idx]
    bar_start_sample = int(bar * BAR_DUR * SAMPLE_RATE)
    bar_num_samples = int(BAR_DUR * SAMPLE_RATE)
    
    # Play chord on beat 1 and a soft anticipation hit on beat 3.5
    hits = [(0.0, 1.0), (2.5, 0.6)]
    for hit_beat, hit_vol in hits:
        hit_start = bar_start_sample + int(hit_beat * BEAT_DUR * SAMPLE_RATE)
        hit_dur_samples = int(BAR_DUR * 1.5 * SAMPLE_RATE)
        
        for note_name in chord['notes']:
            freq = note_freq(note_name)
            # Detune slightly for lofi warmth
            detune = random.uniform(-0.8, 0.8)
            f = freq + detune
            
            for i in range(hit_dur_samples):
                idx = hit_start + i
                if idx >= NUM_SAMPLES:
                    break
                t = i / SAMPLE_RATE
                
                # Envelope: fast attack, exponential decay
                env = math.exp(-i / (SAMPLE_RATE * 1.2)) * hit_vol
                
                # Harmonic synthesis for warm Rhodes tone
                signal = (
                    0.5 * math.sin(2 * math.pi * f * t) +
                    0.25 * math.sin(2 * math.pi * f * 2 * t) * math.exp(-t * 2) +
                    0.15 * math.sin(2 * math.pi * f * 3 * t) * math.exp(-t * 4) +
                    0.1 * math.sin(2 * math.pi * f * 4 * t) * math.exp(-t * 6)
                ) * env * 0.15
                
                # Tremolo (LFO)
                lfo = 1.0 + 0.12 * math.sin(2 * math.pi * 5.0 * t)
                signal *= lfo
                
                # Stereo placement
                pan = random.uniform(0.3, 0.7)
                left_channel[idx] += signal * (1.0 - pan)
                right_channel[idx] += signal * pan

# 2. Synthesize Sub/Smooth Bassline
for bar in range(TOTAL_BARS):
    chord_idx = bar % len(chords)
    root_freq = note_freq(chords[chord_idx]['root']) / 2.0  # One octave lower
    bar_start_sample = int(bar * BAR_DUR * SAMPLE_RATE)
    
    # Bass rhythm pattern: beats 1, 2.5, 3.5
    bass_hits = [(0.0, 1.0, 2.2), (2.0, 0.7, 1.0), (3.0, 0.85, 1.0)]
    for b_beat, b_vol, b_len in bass_hits:
        b_start = bar_start_sample + int(b_beat * BEAT_DUR * SAMPLE_RATE)
        b_samples = int(b_len * BEAT_DUR * SAMPLE_RATE)
        
        for i in range(b_samples):
            idx = b_start + i
            if idx >= NUM_SAMPLES:
                break
            t = i / SAMPLE_RATE
            env = math.exp(-i / (SAMPLE_RATE * 0.8)) * b_vol
            # Smooth sine wave sub-bass with gentle 2nd harmonic
            sub = (0.8 * math.sin(2 * math.pi * root_freq * t) + 0.2 * math.sin(2 * math.pi * root_freq * 2 * t)) * env * 0.22
            left_channel[idx] += sub
            right_channel[idx] += sub

# 3. Drums (Kick, Snare/Clap, Hi-Hat)
for bar in range(TOTAL_BARS):
    bar_start_sample = int(bar * BAR_DUR * SAMPLE_RATE)
    
    # KICK: Beat 1, Beat 2.5, Beat 3.5
    kicks = [0.0, 2.5, 3.25]
    for k_beat in kicks:
        k_start = bar_start_sample + int(k_beat * BEAT_DUR * SAMPLE_RATE)
        k_samples = int(0.25 * SAMPLE_RATE)
        for i in range(k_samples):
            idx = k_start + i
            if idx >= NUM_SAMPLES:
                break
            t = i / SAMPLE_RATE
            # Pitch sweep kick (120 Hz down to 45 Hz)
            freq = 130 * math.exp(-t * 35) + 45
            env = math.exp(-t * 20)
            kick_val = math.sin(2 * math.pi * freq * t) * env * 0.45
            left_channel[idx] += kick_val
            right_channel[idx] += kick_val

    # SNARE / RIM: Beat 2, Beat 4
    snares = [1.0, 3.0]
    for s_beat in snares:
        s_start = bar_start_sample + int(s_beat * BEAT_DUR * SAMPLE_RATE)
        s_samples = int(0.2 * SAMPLE_RATE)
        for i in range(s_samples):
            idx = s_start + i
            if idx >= NUM_SAMPLES:
                break
            t = i / SAMPLE_RATE
            # Tone + Noise burst
            tone = math.sin(2 * math.pi * 180 * t) * math.exp(-t * 30) * 0.2
            noise = random.uniform(-1.0, 1.0) * math.exp(-t * 22) * 0.25
            snare_val = tone + noise
            left_channel[idx] += snare_val * 0.85
            right_channel[idx] += snare_val * 0.85

    # HI-HATS: Every 8th note (0, 0.5, 1.0, 1.5, ...)
    for h in range(8):
        h_beat = h * 0.5
        h_start = bar_start_sample + int((h_beat + random.uniform(-0.02, 0.02)) * BEAT_DUR * SAMPLE_RATE)
        h_samples = int(0.08 * SAMPLE_RATE)
        h_vol = 0.22 if h % 2 == 0 else 0.14  # Accent on-beats
        
        for i in range(h_samples):
            idx = h_start + i
            if idx >= NUM_SAMPLES:
                break
            t = i / SAMPLE_RATE
            # Filtered noise for soft lo-fi hi-hat
            noise = random.uniform(-1.0, 1.0) * math.exp(-t * 60) * h_vol
            left_channel[idx] += noise * 0.7
            right_channel[idx] += noise * 0.9

# 4. Lo-Fi Vinyl Crackle & Ambient Warmth
for i in range(NUM_SAMPLES):
    if random.random() < 0.0015:
        # Vinyl pop/crackle
        pop = random.uniform(-0.08, 0.08)
        left_channel[i] += pop
        right_channel[i] += pop
    # Very gentle hiss background
    hiss = random.uniform(-0.003, 0.003)
    left_channel[i] += hiss
    right_channel[i] += hiss

# Normalize and convert to 16-bit PCM integer WAV
max_val = max(max(abs(x) for x in left_channel), max(abs(y) for y in right_channel))
scale = 0.85 / max_val if max_val > 0 else 1.0

wav_file = wave.open("lofi_upbeat_beat.wav", "wb")
wav_file.setnchannels(2)
wav_file.setsampwidth(2)
wav_file.setframerate(SAMPLE_RATE)

frames = []
for i in range(NUM_SAMPLES):
    l_sample = int(left_channel[i] * scale * 32767)
    r_sample = int(right_channel[i] * scale * 32767)
    # Clamp
    l_sample = max(-32768, min(32767, l_sample))
    r_sample = max(-32768, min(32767, r_sample))
    frames.append(struct.pack('<hh', l_sample, r_sample))

wav_file.writeframes(b''.join(frames))
wav_file.close()

print("Successfully generated 'lofi_upbeat_beat.wav'!")
