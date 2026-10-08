# Sound Effects & Audio Credits

GitRoast Arena uses a hybrid sound design:
1. **Procedural Web Audio Synthesis (Zero-Latency / Built-in)**:
   - Whoosh, Pop, Sizzle, Click, Stinger, Rimshot are procedurally synthesized using Web Audio API oscillators and noise buffers without external audio files.

2. **Progressive Enhancement Audio Assets (Optional CC0 / Royalty-Free)**:
   The application looks for short fallback / audio files in `/public/sfx/`. If missing, the app seamlessly falls back to procedural Web Audio synthesis.

### Optional Sound Files Reference:
- `smirk-01.mp3`: Short sly chuckle or smug audio cue (< 60 KB). Source: CC0 / Freesound.org.
- `laugh-sarcastic-01.mp3`: Mocking/sarcastic developer chuckle (< 60 KB). Source: CC0 / Freesound.org.
- `laugh-evil-01.mp3`: Dramatic villainous cackle for savage roasts (< 60 KB). Source: CC0 / Freesound.org.
- `rimshot.mp3`: Ba-dum-tss drum sting (< 60 KB). Source: CC0 / Freesound.org.

### Licensing:
All synthesized sounds are generated dynamically at runtime under the project's MIT License. Any supplementary audio files placed in this folder should be CC0 Public Domain or royalty-free with no attribution required.
