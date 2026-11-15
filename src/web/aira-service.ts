import { createAvatar, type AvatarController } from './avatar-runtime.js';
import { airaAvatarDefinition } from './aira-avatar-data.js';

export type AiraVisualState =
  | 'idle'
  | 'welcoming'
  | 'thinking'
  | 'speaking'
  | 'focused'
  | 'encouraging'
  | 'resting'
  | 'celebrating'
  | 'paused';

export class AiraCoachService {
  private chatAvatar: AvatarController | null = null;
  private screenAvatar: AvatarController | null = null;
  private currentScreenKey = '';
  private currentScreenState: AiraVisualState = 'idle';
  private isSpeaking = false;
  private isThinking = false;
  private isPaused = false;
  private midpointTriggered = false;

  initChatAvatar(container: HTMLElement): AvatarController | null {
    try {
      if (this.chatAvatar) {
        this.chatAvatar.destroy();
        this.chatAvatar = null;
      }
      container.replaceChildren();
      this.chatAvatar = createAvatar(container, {
        definition: airaAvatarDefinition,
        defaultAnimation: 'listening',
        size: '100%',
        ariaLabel: 'Aira virtual workout coach',
      });
      return this.chatAvatar;
    } catch (err) {
      console.warn('[AiraCoach] Could not initialize chat avatar:', err);
      return null;
    }
  }

  mountScreenAvatar(container: HTMLElement, size: number = 76): AvatarController | null {
    try {
      if (this.screenAvatar) {
        this.screenAvatar.destroy();
        this.screenAvatar = null;
      }
      container.replaceChildren();
      const initialAnimation = this.getAnimationForState(this.currentScreenState);
      this.screenAvatar = createAvatar(container, {
        definition: airaAvatarDefinition,
        defaultAnimation: initialAnimation,
        size,
        ariaLabel: 'Aira active coach avatar',
      });
      this.applyState(this.currentScreenState);
      return this.screenAvatar;
    } catch (err) {
      console.warn('[AiraCoach] Could not initialize screen avatar:', err);
      return null;
    }
  }

  destroyScreenAvatar(): void {
    if (this.screenAvatar) {
      try {
        this.screenAvatar.destroy();
      } catch {}
      this.screenAvatar = null;
    }
  }

  setScreen(screenKey: string): void {
    if (screenKey !== this.currentScreenKey) {
      this.midpointTriggered = false;
      this.currentScreenKey = screenKey;
    }
    const state = this.determineStateForScreen(screenKey);
    this.currentScreenState = state;
    if (!this.isSpeaking && !this.isThinking) {
      this.applyState(state);
    }
  }

  onConversationPending(pending: boolean): void {
    this.isThinking = pending;
    if (pending) {
      this.applyChatAvatarState('thinking');
    } else {
      this.applyChatAvatarState(this.currentScreenState);
    }
  }

  onSpeechStart(): void {
    this.isSpeaking = true;
    this.applyState('speaking');
  }

  onSpeechEnd(): void {
    this.isSpeaking = false;
    this.applyState(this.currentScreenState);
  }

  onTimerTick(status: string, remaining: number, total: number): void {
    if (this.isSpeaking || this.isThinking) return;

    if (status === 'running') {
      if (total > 15 && remaining <= total / 2 && remaining >= (total / 2) - 2 && !this.midpointTriggered) {
        this.midpointTriggered = true;
        this.applyState('encouraging');
        setTimeout(() => {
          if (!this.isSpeaking && !this.isThinking && this.currentScreenState === 'focused') {
            this.applyState('focused');
          }
        }, 3200);
      } else if (!this.midpointTriggered && this.currentScreenState !== 'focused') {
        this.applyState('focused');
      }
    } else if (status === 'done') {
      this.applyState('celebrating');
    } else if (status === 'paused') {
      this.pause();
    }
  }

  pause(): void {
    this.isPaused = true;
    try {
      this.chatAvatar?.pause();
      this.screenAvatar?.pause();
    } catch {}
  }

  resume(): void {
    this.isPaused = false;
    this.applyState(this.currentScreenState);
  }

  reset(): void {
    this.isSpeaking = false;
    this.isThinking = false;
    this.isPaused = false;
    this.midpointTriggered = false;
    this.currentScreenKey = '';
    this.currentScreenState = 'welcoming';
    try {
      this.chatAvatar?.play('listening');
      this.chatAvatar?.setExpression('neutral');
      this.destroyScreenAvatar();
    } catch {}
  }

  getGreetingText(): string {
    return "Hey, I'm Aira. Ready to get moving?";
  }

  private determineStateForScreen(screenKey: string): AiraVisualState {
    if (!screenKey || screenKey === 's_welcome') {
      return 'welcoming';
    }
    if (screenKey === 's_warmup') {
      return 'focused';
    }
    if (screenKey.includes('intro')) {
      return 'encouraging';
    }
    if (screenKey.includes('squats') || screenKey.includes('pushups') || screenKey.includes('highknees')) {
      return 'focused';
    }
    if (screenKey.includes('rest')) {
      return 'resting';
    }
    if (screenKey === 's_done') {
      return 'celebrating';
    }
    return 'idle';
  }

  private getAnimationForState(state: AiraVisualState): string {
    switch (state) {
      case 'welcoming':
        return 'happy';
      case 'thinking':
        return 'thinking';
      case 'speaking':
        return 'listening';
      case 'focused':
        return 'working';
      case 'encouraging':
        return 'excited';
      case 'resting':
        return 'sleeping';
      case 'celebrating':
        return 'celebrate';
      case 'paused':
      case 'idle':
      default:
        return 'idle';
    }
  }

  private getExpressionForState(state: AiraVisualState): string {
    switch (state) {
      case 'welcoming':
        return 'joyful-wide';
      case 'thinking':
        return 'curious-left';
      case 'speaking':
        return 'attentive-left';
      case 'focused':
        return 'small-attentive';
      case 'encouraging':
        return 'joyful-wide';
      case 'resting':
        return 'gentle-downward-gaze';
      case 'celebrating':
        return 'joyful-down-right';
      case 'paused':
      case 'idle':
      default:
        return 'neutral';
    }
  }

  private applyState(state: AiraVisualState): void {
    if (this.isPaused) return;
    const anim = this.getAnimationForState(state);
    const exp = this.getExpressionForState(state);
    try {
      this.chatAvatar?.play(anim);
      this.chatAvatar?.setExpression(exp);
      this.screenAvatar?.play(anim);
      this.screenAvatar?.setExpression(exp);
    } catch {}
  }

  private applyChatAvatarState(state: AiraVisualState): void {
    if (this.isPaused) return;
    const anim = this.getAnimationForState(state);
    const exp = this.getExpressionForState(state);
    try {
      this.chatAvatar?.play(anim);
      this.chatAvatar?.setExpression(exp);
    } catch {}
  }

  createWelcomeCompanion(onStart?: () => void): HTMLElement {
    const card = document.createElement('div');
    card.className = 'aira-welcome-card';
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'aira-welcome-avatar';
    const textWrap = document.createElement('div');
    textWrap.className = 'aira-welcome-text';
    const badge = document.createElement('span');
    badge.className = 'eyebrow';
    badge.textContent = 'YOUR VIRTUAL COACH';
    const title = document.createElement('h4');
    title.className = 'aira-welcome-title';
    title.textContent = "Hey, I'm Aira. Ready to get moving?";
    const desc = document.createElement('p');
    desc.className = 'aira-welcome-desc';
    desc.textContent = "I'll guide your form, track your intervals, and keep your energy high through every round.";
    textWrap.append(badge, title, desc);
    if (onStart) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'aira-welcome-action';
      btn.textContent = "Start Workout →";
      btn.addEventListener('click', onStart);
      textWrap.append(btn);
    }
    card.append(avatarWrap, textWrap);
    setTimeout(() => this.mountScreenAvatar(avatarWrap, 84), 0);
    return card;
  }

  createWorkoutCoachCard(cueText: string, statementKey?: string): HTMLElement {
    const card = document.createElement('aside');
    card.className = 'aira-coach-card alert';
    if (statementKey) {
      card.dataset.statement = statementKey;
    }
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'aira-coach-card-avatar';
    const body = document.createElement('div');
    body.className = 'aira-coach-card-body';
    const tag = document.createElement('span');
    tag.className = 'aira-coach-tag';
    tag.textContent = 'COACH AIRA · FORM CUE';
    const cue = document.createElement('p');
    cue.className = 'aira-coach-cue';
    cue.textContent = cueText || 'Focus on controlled tempo and steady breathing.';
    body.append(tag, cue);
    card.append(avatarWrap, body);
    setTimeout(() => this.mountScreenAvatar(avatarWrap, 52), 0);
    return card;
  }

  createRestCoachCard(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'aira-screen-coach aira-screen-rest';
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'aira-screen-avatar-wrap';
    const content = document.createElement('div');
    content.className = 'aira-screen-coach-content';
    const badge = document.createElement('span');
    badge.className = 'micro aira-screen-badge';
    badge.textContent = 'COACH AIRA · ACTIVE RECOVERY';
    const greeting = document.createElement('h4');
    greeting.className = 'aira-coach-greeting';
    greeting.textContent = 'Take a deep breath. Shake out your muscles.';
    const intro = document.createElement('p');
    intro.className = 'aira-coach-intro';
    intro.textContent = 'Lower your heart rate with slow exhales. Round 2 is coming up next.';
    content.append(badge, greeting, intro);
    card.append(avatarWrap, content);
    setTimeout(() => this.mountScreenAvatar(avatarWrap, 74), 0);
    return card;
  }

  createDoneCoachCard(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'aira-screen-coach aira-screen-done';
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'aira-screen-avatar-wrap';
    const content = document.createElement('div');
    content.className = 'aira-screen-coach-content';
    const badge = document.createElement('span');
    badge.className = 'micro aira-screen-badge';
    badge.textContent = 'WORKOUT COMPLETED · GREAT JOB!';
    const greeting = document.createElement('h4');
    greeting.className = 'aira-coach-greeting';
    greeting.textContent = 'Outstanding effort! You crushed ENERGIZE!';
    const intro = document.createElement('p');
    intro.className = 'aira-coach-intro';
    intro.textContent = 'Hydrate, stretch your legs, and come back for your next session tomorrow.';
    content.append(badge, greeting, intro);
    card.append(avatarWrap, content);
    setTimeout(() => this.mountScreenAvatar(avatarWrap, 84), 0);
    return card;
  }

  createIntroCoachCard(roundTitle: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'aira-screen-coach aira-screen-intro';
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'aira-screen-avatar-wrap';
    const content = document.createElement('div');
    content.className = 'aira-screen-coach-content';
    const badge = document.createElement('span');
    badge.className = 'micro aira-screen-badge';
    badge.textContent = 'COACH AIRA · CIRCUIT PREVIEW';
    const greeting = document.createElement('h4');
    greeting.className = 'aira-coach-greeting';
    greeting.textContent = `Get ready for ${roundTitle}. 3 exercises, 40s each.`;
    const intro = document.createElement('p');
    intro.className = 'aira-coach-intro';
    intro.textContent = 'Give every interval high intensity with clean form.';
    content.append(badge, greeting, intro);
    card.append(avatarWrap, content);
    setTimeout(() => this.mountScreenAvatar(avatarWrap, 74), 0);
    return card;
  }
}
