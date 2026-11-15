/**
 * @license AGPL-3.0-only
 * Bible Strong Avatar Lab typings
 * Copyright (c) 2024 Stéphane Montlouis-Calixte
 */
export type AnimationKey =
  | 'sleeping'
  | 'waking'
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'searching'
  | 'working'
  | 'excited'
  | 'bored'
  | 'suspicious'
  | 'angry'
  | 'drowsy'
  | 'happy'
  | 'curious'
  | 'confused'
  | 'surprised'
  | 'proud'
  | 'shy'
  | 'sad'
  | 'laughing'
  | 'scared'
  | 'playful'
  | 'celebrate'
  | string;

export type ExpressionKey =
  | 'neutral'
  | 'upward-side-glance'
  | 'downward-gaze'
  | 'skeptical-right'
  | 'small-attentive'
  | 'wide-downward-gaze'
  | 'surprised-left'
  | 'sleepy-squint'
  | 'angry-right'
  | 'curious-left'
  | 'asymmetric-down-right'
  | 'attentive-left'
  | 'joyful-wide'
  | 'eyes-closed'
  | 'joyful-down-right'
  | 'skeptical-left'
  | 'far-right-glance'
  | 'angry-left'
  | 'playful-right'
  | 'asymmetric-up-left'
  | 'gentle-downward-gaze'
  | 'wide-down-left'
  | 'surprised-wide-left'
  | 'drowsy-closed'
  | 'suspicious-right'
  | 'shy-downward'
  | 'angry-brows'
  | 'uneasy-left'
  | string;

export type AvatarCommandResult =
  | { ok: true }
  | { ok: false; error: { code: string; message: string } };

export type AvatarPlaybackState = {
  activeAnimation?: AnimationKey;
  activeExpression: ExpressionKey;
  status: 'playing' | 'paused' | 'stopped';
};

export type AvatarController = {
  play(animation: AnimationKey): AvatarCommandResult;
  setExpression(expression: ExpressionKey): AvatarCommandResult;
  pause(): void;
  stop(): void;
  getState(): AvatarPlaybackState;
  destroy(): void;
};

export type CreateAvatarOptions = {
  definition: unknown;
  defaultAnimation?: AnimationKey;
  defaultExpression?: ExpressionKey;
  autoplay?: boolean;
  size?: number | string;
  ariaLabel?: string;
  className?: string;
  onError?: (error: { code: string; message: string }) => void;
  onAnimationEnd?: (animation: AnimationKey) => void;
  onExpressionChange?: (expression: ExpressionKey) => void;
};

export function createAvatar(
  target: string | HTMLElement,
  options: CreateAvatarOptions
): AvatarController;
