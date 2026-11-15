import { el, button } from './dom.js';
import type { StatementNode } from '../shared/openui/openui-model.js';
import type { TimerLedger } from '../shared/openui/timer-store.js';

export type Context = {
  send: (text: string) => void;
  timers: TimerLedger;
  timerAction: (id: string, action: 'start' | 'pause' | 'reset' | 'finish') => void;
  updates: (() => void)[];
  paused: boolean;
};

let activeVideoElement: HTMLVideoElement | null = null;

export function stopAndCleanupVideo() {
  if (activeVideoElement) {
    try {
      activeVideoElement.pause();
      activeVideoElement.currentTime = 0;
      activeVideoElement.removeAttribute('src');
      activeVideoElement.load();
    } catch {}
    activeVideoElement = null;
  }
}

// Trusted DOM ports of the source component signatures; no model-generated code.
export const renderers: Record<string, (node: StatementNode, context: Context) => HTMLElement> = {
  Text: ({ props: p }) => el(p.variant === 'title' ? 'h3' : p.variant === 'subtitle' ? 'h4' : 'p', String(p.text), 'block block-' + String(p.variant ?? 'body')),

  Keyword: ({ props: p }) => {
    const n = el('div', '', 'keyword');
    n.append(el('strong', String(p.text)));
    if (p.caption) n.append(el('p', String(p.caption)));
    return n;
  },

  Alert: ({ props: p }) => el('aside', String(p.text), 'block alert alert-' + String(p.tone ?? 'info')),

  List: ({ props: p }, c) => {
    const n = el('ul', '', 'block workout-list');
    for (const row of p.items as StatementNode[]) n.append(renderComponent(row, c));
    return n;
  },

  ListItem: ({ props: p }) => el('li', String(p.text), 'workout-list-item' + (p.marker ? ' marker-' + String(p.marker) : '')),

  FollowUps: ({ props: p }, c) => {
    const n = el('div', '', 'row followups');
    for (const text of p.prompts as string[]) n.append(button(text, () => c.send(text)));
    return n;
  },

  Timer: ({ key, props: p }, c) => {
    const n = el('section', '', 'timer');
    n.setAttribute('aria-label', String(p.label));
    n.append(
      el('p', 'SIMULATED TIMER · LOCAL ONLY', 'eyebrow'),
      el('h3', String(p.label))
    );

    const dialWrap = el('div', '', 'timer-dial-container');
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 140 140');
    svg.setAttribute('class', 'timer-ring-svg');
    svg.setAttribute('aria-hidden', 'true');

    const track = document.createElementNS(svgNS, 'circle');
    track.setAttribute('cx', '70');
    track.setAttribute('cy', '70');
    track.setAttribute('r', '58');
    track.setAttribute('class', 'timer-ring-track');

    const indicator = document.createElementNS(svgNS, 'circle');
    indicator.setAttribute('cx', '70');
    indicator.setAttribute('cy', '70');
    indicator.setAttribute('r', '58');
    indicator.setAttribute('class', 'timer-ring-indicator');
    const circumference = 2 * Math.PI * 58;
    indicator.style.strokeDasharray = `${circumference}`;
    indicator.style.strokeDashoffset = '0';

    svg.append(track, indicator);

    const dialCenter = el('div', '', 'timer-dial-center');
    const value = el('strong');
    const status = el('span', '', 'micro timer-status');
    dialCenter.append(value, status);
    dialWrap.append(svg, dialCenter);

    const row = el('div', '', 'row timer-actions');
    const start = button('Start simulation', () => c.timerAction(key, 'start'));
    const pause = button('Pause timer', () => c.timerAction(key, 'pause'));
    const reset = button('Reset timer', () => c.timerAction(key, 'reset'));
    const finish = button('Simulate finish', () => c.timerAction(key, 'finish'));
    row.append(start, pause, reset, finish);

    n.append(dialWrap, row, el('p', 'Finishing records a local timer event.', 'micro'));

    const update = () => {
      const entry = c.timers.list().find(t => t.id === key);
      if (!entry) return;
      const seconds = Math.ceil(entry.remaining);
      value.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
      status.textContent = entry.status;

      const total = entry.seconds > 0 ? entry.seconds : 40;
      const progressFraction = Math.max(0, Math.min(1, entry.remaining / total));
      indicator.style.strokeDashoffset = `${circumference * (1 - progressFraction)}`;

      n.classList.toggle('is-running', entry.status === 'running');
      n.classList.toggle('is-paused', entry.status === 'paused');
      n.classList.toggle('is-done', entry.status === 'done');

      start.hidden = entry.status === 'running' || entry.status === 'paused';
      start.textContent = entry.status === 'done' ? 'Restart simulation' : 'Start simulation';
      pause.hidden = entry.status === 'stopped' || entry.status === 'done';
      pause.textContent = entry.status === 'paused' ? 'Resume timer' : 'Pause timer';
      for (const b of [start, pause, reset, finish]) b.disabled = c.paused;
    };
    c.updates.push(update);
    update();
    return n;
  },

  Video: ({ props: p }, c) => {
    const n = el('section', '', 'exercise-video-card');
    n.setAttribute('aria-label', String(p.label || 'Exercise movement demonstration'));

    const header = el('div', '', 'video-header');
    const liveTag = el('span', '● MOVEMENT DEMO', 'video-live-badge');
    const labelTag = el('span', String(p.label || 'Form Demonstration'), 'video-exercise-title');
    header.append(liveTag, labelTag);

    const viewport = el('div', '', 'video-viewport');
    const video = document.createElement('video');
    video.className = 'exercise-video-player';
    video.src = String(p.src);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-label', `${String(p.label || 'Exercise')} demonstration`);

    const fallback = el('div', '', 'video-fallback');
    fallback.hidden = true;
    const fbBadge = el('span', 'FORM GUIDE', 'video-fallback-badge');
    const fbTitle = el('strong', `${String(p.label || 'Exercise')} Demonstration`, 'video-fallback-title');
    const fbDesc = el('p', 'Follow the coaching guidance below. Maintain controlled reps and steady breathing.', 'video-fallback-desc');
    fallback.append(fbBadge, fbTitle, fbDesc);

    const controls = el('div', '', 'video-controls');
    const replay = button('↻ Replay demo', () => {
      try {
        video.currentTime = 0;
        video.play().catch(() => {});
      } catch {}
    });
    replay.className = 'video-replay-btn';
    replay.title = 'Replay movement demonstration';
    controls.append(replay);

    let failed = false;
    video.addEventListener('error', () => {
      failed = true;
      video.style.display = 'none';
      fallback.hidden = false;
    });

    if (activeVideoElement && activeVideoElement !== video) {
      try {
        activeVideoElement.pause();
        activeVideoElement.currentTime = 0;
        activeVideoElement.removeAttribute('src');
        activeVideoElement.load();
      } catch {}
    }
    activeVideoElement = video;

    if (!c.paused) {
      video.play().catch(() => {
        // Autoplay handled safely
      });
    }

    const update = () => {
      if (failed) return;
      replay.disabled = c.paused;
      if (c.paused) {
        if (!video.paused) video.pause();
      } else {
        if (video.paused && !video.ended) {
          video.play().catch(() => {});
        }
      }
    };
    c.updates.push(update);
    update();

    viewport.append(video, fallback, controls);
    n.append(header, viewport);
    return n;
  },
};

export function renderComponent(node: StatementNode, context: Context): HTMLElement {
  if (!Object.hasOwn(renderers, node.name)) throw new Error('No renderer for ' + node.name);
  const n = renderers[node.name](node, context);
  n.dataset.statement = node.key;
  if (typeof node.props.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(node.props.color)) n.style.color = node.props.color;
  return n;
}
