// Audio synthesis for sound effects and text-to-speech using standard Web Audio & SpeechSynthesis APIs

class AudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private viVoice: SpeechSynthesisVoice | null = null;
  private currentUtteranceQueue: SpeechSynthesisUtterance[] = [];
  private isSpeakingQueue: boolean = false;

  constructor() {
    this.initVoices();
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Play a cheerful chime on correct answer
  public playCorrect() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Ignore audio failure
    }
  }

  // Play a gentle informative buzz on mistake (not harsh)
  public playIncorrect() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.setValueAtTime(293.66, now + 0.15); // D4

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }

  // Play fanfare when completing a game or lesson
  public playCelebration() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.15, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    } catch {
      // Ignore
    }
  }

  private currentAudioElement: HTMLAudioElement | null = null;

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      this.cachedVoices = window.speechSynthesis.getVoices();
      this.viVoice = this.findBestVietnameseVoice(this.cachedVoices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private findBestVietnameseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (!voices || voices.length === 0) return null;

    // 1. Prioritize natural/online Vietnamese voices
    const priorityNames = [
      'google tiếng việt',
      'google vi-vn',
      'microsoft hoaimy',
      'microsoft nam',
      'microsoft an',
      'linh',
      'mai'
    ];

    for (const p of priorityNames) {
      const match = voices.find(
        v => v.name.toLowerCase().includes(p) || (v.lang.toLowerCase().includes('vi') && v.name.toLowerCase().includes(p))
      );
      if (match) return match;
    }

    // 2. Any voice strictly matching language code 'vi-vn' or 'vi_vn' or starting with 'vi'
    const viLangMatch = voices.find(
      v =>
        v.lang.toLowerCase() === 'vi-vn' ||
        v.lang.toLowerCase() === 'vi_vn' ||
        v.lang.toLowerCase().startsWith('vi-') ||
        v.lang.toLowerCase() === 'vi'
    );
    if (viLangMatch) return viLangMatch;

    // 3. Any voice containing "vietnam" or "tiếng việt" in name
    const viNameMatch = voices.find(
      v =>
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('tiếng việt')
    );
    if (viNameMatch) return viNameMatch;

    // Return null if NO legitimate Vietnamese voice exists (ABSOLUTELY NO ENGLISH VOICE FALLBACK)
    return null;
  }

  public hasVietnameseVoice(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    if (!this.viVoice) {
      this.viVoice = this.findBestVietnameseVoice(window.speechSynthesis.getVoices());
    }
    return !!this.viVoice;
  }

  public getAvailableVietnameseVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices().filter(v => 
      v.lang.toLowerCase().startsWith('vi') ||
      v.name.toLowerCase().includes('tiếng việt') ||
      v.name.toLowerCase().includes('vietnam')
    );
  }

  public getVietnameseVoiceInfo(): { hasVoice: boolean; voiceName: string; lang: string } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { hasVoice: false, voiceName: 'Không hỗ trợ Web Speech', lang: '' };
    }
    if (!this.viVoice) {
      this.viVoice = this.findBestVietnameseVoice(window.speechSynthesis.getVoices());
    }
    if (this.viVoice) {
      return {
        hasVoice: true,
        voiceName: this.viVoice.name,
        lang: this.viVoice.lang,
      };
    }
    return {
      hasVoice: false,
      voiceName: 'Thiết bị chưa có giọng đọc Tiếng Việt',
      lang: '',
    };
  }

  // Teacher TTS Permission in settings (Default FALSE until verified on device)
  public isTtsPermitted(): boolean {
    if (typeof window === 'undefined') return false;
    // Must have a real Vietnamese voice AND have permission enabled
    if (!this.hasVietnameseVoice()) return false;
    const stored = localStorage.getItem('vd_smart_ai_tts_permitted');
    // If user has verified or explicitly enabled
    return stored === 'true';
  }

  public setTtsPermitted(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('vd_smart_ai_tts_permitted', enabled ? 'true' : 'false');
  }

  // Teacher test phrase: "Xin chào các em. Hôm nay chúng mình cùng học Tiếng Việt lớp Hai nhé!"
  public testVietnameseVoice(onDone?: () => void, rate: number = 0.88): boolean {
    if (!this.hasVietnameseVoice()) {
      if (onDone) onDone();
      return false;
    }
    const testPhrase = 'Xin chào các em. Hôm nay chúng mình cùng học Tiếng Việt lớp Hai nhé!';
    this.speakText(testPhrase, onDone, rate);
    return true;
  }

  // Text-To-Speech for reading lessons & Mầm AI speaking
  // GUARANTEE: Never speaks if there is no authentic Vietnamese voice!
  public speakText(text: string, onEnd?: () => void, rate: number = 0.88) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    if (!this.viVoice) {
      this.viVoice = this.findBestVietnameseVoice(window.speechSynthesis.getVoices());
    }

    // STRICT SAFETY CHECK: If no Vietnamese voice is present, DO NOT SPEAK!
    // Never fallback to system default (which would read Vietnamese with an English accent)
    if (!this.viVoice) {
      console.warn('Vĩnh Điều Smart AI: Thiết bị không có voice Tiếng Việt (vi-VN). Đã hủy phát âm thanh để tránh đọc giọng tiếng Anh.');
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stopSpeaking();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.viVoice;
      utterance.lang = this.viVoice.lang || 'vi-VN';
      utterance.rate = Math.max(0.8, Math.min(1.0, rate)); // 0.85 - 0.95 optimal for Grade 2
      utterance.pitch = 1.05;

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  // Sentence-by-sentence reading with highlight tracking for reading passages
  public speakSentences(
    sentences: string[],
    onSentenceChange: (index: number) => void,
    onComplete: () => void,
    rate: number = 0.88
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || sentences.length === 0) {
      onComplete();
      return;
    }

    if (!this.viVoice) {
      this.viVoice = this.findBestVietnameseVoice(window.speechSynthesis.getVoices());
    }

    // STRICT SAFETY CHECK: Never speak with non-Vietnamese voice!
    if (!this.viVoice) {
      console.warn('Vĩnh Điều Smart AI: Không tìm thấy giọng Tiếng Việt. Đã hủy đọc mẫu.');
      onComplete();
      return;
    }

    this.stopSpeaking();
    this.isSpeakingQueue = true;

    let currentIndex = 0;

    const speakNext = () => {
      if (!this.isSpeakingQueue || currentIndex >= sentences.length) {
        this.isSpeakingQueue = false;
        onComplete();
        return;
      }

      const sentenceText = sentences[currentIndex].trim();
      if (!sentenceText) {
        currentIndex++;
        speakNext();
        return;
      }

      onSentenceChange(currentIndex);

      const utterance = new SpeechSynthesisUtterance(sentenceText);
      utterance.voice = this.viVoice!;
      utterance.lang = this.viVoice!.lang || 'vi-VN';
      utterance.rate = Math.max(0.8, Math.min(1.0, rate));
      utterance.pitch = 1.05;

      utterance.onend = () => {
        currentIndex++;
        setTimeout(() => {
          if (this.isSpeakingQueue) {
            speakNext();
          }
        }, 220);
      };

      utterance.onerror = () => {
        currentIndex++;
        speakNext();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }

  // Play teacher's uploaded custom MP3 audio
  public playCustomAudio(url: string, onEnd?: () => void): HTMLAudioElement | null {
    this.stopSpeaking();
    this.stopCustomAudio();

    try {
      const audio = new Audio(url);
      this.currentAudioElement = audio;
      audio.onended = () => {
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };
      audio.play().catch(e => {
        console.warn('Audio play failed:', e);
        if (onEnd) onEnd();
      });
      return audio;
    } catch {
      if (onEnd) onEnd();
      return null;
    }
  }

  public stopCustomAudio() {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {}
      this.currentAudioElement = null;
    }
  }

  public stopSpeaking() {
    this.isSpeakingQueue = false;
    this.stopCustomAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioService = new AudioService();
