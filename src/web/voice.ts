export class VoiceCoach {
  private enabled = false;
  private supported: boolean;
  private lastSpokenKey = '';
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onSpeechStartCallback?: () => void;
  private onSpeechEndCallback?: () => void;

  constructor() {
    this.supported =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined';
  }

  setSpeechCallbacks(onStart?: () => void, onEnd?: () => void): void {
    this.onSpeechStartCallback = onStart;
    this.onSpeechEndCallback = onEnd;
  }

  isSupported(): boolean {
    return this.supported;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  setEnabled(val: boolean): void {
    this.enabled = val;
    if (!val) {
      this.cancel();
    }
  }

  cancel(): void {
    if (this.supported) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.currentUtterance = null;
    this.onSpeechEndCallback?.();
  }

  reset(): void {
    this.cancel();
    this.lastSpokenKey = '';
  }

  speakForScreen(screenKey: string, text: string): void {
    if (!this.enabled || !this.supported) return;
    if (!text || !text.trim()) return;

    // Prevent duplicate speech when DOM re-renders or updates without a screen transition
    if (screenKey && screenKey === this.lastSpokenKey) return;
    this.lastSpokenKey = screenKey;

    this.cancel();

    try {
      const cue = this.extractConciseCue(text);
      if (!cue) return;

      const utterance = new SpeechSynthesisUtterance(cue);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.95;

      utterance.onstart = () => {
        this.onSpeechStartCallback?.();
      };
      utterance.onerror = () => {
        this.currentUtterance = null;
        this.onSpeechEndCallback?.();
      };
      utterance.onend = () => {
        this.currentUtterance = null;
        this.onSpeechEndCallback?.();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Gracefully handle browser speech synthesis exceptions
    }
  }

  extractConciseCue(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) return '';
    const sentences = trimmed.split(/(?<=[.!?])\s+/);
    if (!sentences.length) return trimmed;
    if (sentences[0].length < 25 && sentences.length > 1) {
      return `${sentences[0]} ${sentences[1]}`.trim();
    }
    return sentences[0].trim();
  }
}
