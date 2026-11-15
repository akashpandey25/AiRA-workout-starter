import { Conversation } from '../shared/controller.js';
import { APP_VERSION, SCHEMA_VERSION, type Provider, type ProviderStatus, type RequestData, type Result } from '../shared/contracts.js';
import { TimerLedger, type TimerListEntry } from '../shared/openui/timer-store.js';
import { activityClientEvents, timerTransitionEvent } from '../shared/openui/activity-client-events.js';
import { createRunNav } from '../shared/openui/run-nav.js';
import { splitReply } from '../shared/openui/document.js';
import type { StatementNode } from '../shared/openui/openui-model.js';
import { redactValue } from '../shared/redact.js';
import { renderComponent, stopAndCleanupVideo } from './components.js';
import { byId, el } from './dom.js';
import { VoiceCoach } from './voice.js';
import { AiraCoachService } from './aira-service.js';

type Config = { providers: ProviderStatus[]; token: string }; let config: Config | undefined;
const timers = new TimerLedger(), voiceCoach = new VoiceCoach(), airaCoach = new AiraCoachService(); let previousTimers = new Map<string, TimerListEntry>(), updates: (() => void)[] = [], paused = false, pausedTimers: string[] = [], renderKey = '', lastClear = 0;
const draft = byId<HTMLTextAreaElement>('message');
const c = new Conversation(async (request: RequestData, signal: AbortSignal): Promise<Result> => {
  const controller = new AbortController(), abort = () => controller.abort(); signal.addEventListener('abort', abort, { once: true }); const timeout = setTimeout(abort, request.provider === 'claude-cli' ? 85000 : 48000);
  try { const response = await fetch('/api/turn', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Local-Token': config!.token }, body: JSON.stringify(request), signal: controller.signal }); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Request failed.'); return data; }
  catch (error) { if (error instanceof Error && error.name === 'AbortError') throw new Error('Request cancelled or timed out. Retry when ready.'); throw error; }
  finally { clearTimeout(timeout); signal.removeEventListener('abort', abort); }
}, render, () => [...(paused ? ['Preview is currently paused.'] : []), ...timers.list().map(t => `Simulated timer ${t.id} (${t.label}): ${t.status}, ${Math.ceil(t.remaining)} of ${t.seconds} seconds remaining.`)]);
function makeNav() { return createRunNav({ index: () => c.document.screens.findIndex(s => s.key === c.document.cursor), stepCount: () => c.document.screens.length, isConsumed: () => false, awaiting: () => false, leave: () => { voiceCoach.cancel(); airaCoach.destroyScreenAvatar(); if (c.pending) c.cancel('interrupted'); }, land: (from, to) => { c.document.move(to); c.localEvent(to < from ? activityClientEvents.wentBack(`step ${from + 1}`, `step ${to + 1}`) : activityClientEvents.nowOnStep(`step ${to + 1} of ${c.document.screens.length}`)); }, phase: () => { }, finish: () => c.localEvent('Reached the final screen. This is not evidence of physical completion.') }, { outMs: 30, inMs: 30 }); }
let nav = makeNav();
function send(text: string) { if (!config) return; const provider = config.providers.find(p => p.id === c.provider)!; if (!provider.enabled || (c.provider !== 'mock' && !c.consent)) { c.error = 'Set up this provider and agree to usage, or select Mock.'; render(); return; } if (paused) { c.error = 'Resume the preview before sending.'; render(); return; } const f = byId<HTMLSelectElement>('fault'); const fault = f.value as RequestData['fault']; f.value = 'none'; void c.send(text, fault); }
function syncTimers() {
  if (lastClear !== c.document.clearVersion) { nav.dispose(); nav = makeNav(); timers.forget(); previousTimers.clear(); lastClear = c.document.clearVersion; }
  const ids = new Set<string>(); for (const s of c.document.screens) for (const node of s.props.children as StatementNode[]) if (node.name === 'Timer') { ids.add(node.key); timers.ensure(node.key, { label: String(node.props.label), seconds: Number(node.props.seconds) }); }
  for (const t of timers.list()) if (!ids.has(t.id)) { timers.forget(t.id); previousTimers.delete(t.id); }
}
function tick() {
  const snapshot = timers.list();
  for (const entry of snapshot) {
    const before = previousTimers.get(entry.id);
    previousTimers.set(entry.id, { ...entry });
    if (before && before.status !== 'done' && entry.status === 'done') c.localEvent(activityClientEvents.finishedTimer(entry.label), false);
  }
  const running = snapshot.find(t => t.status === 'running');
  if (running) {
    airaCoach.onTimerTick('running', running.remaining, running.seconds);
  }
  updates.forEach(fn => fn());
}
function timerAction(id: string, action: 'start' | 'pause' | 'reset' | 'finish') {
  const before = timers.list().find(t => t.id === id); if (!before || paused) return;
  if (action === 'start') timers.start(id); if (action === 'pause') timers.pause(id); if (action === 'reset') timers.reset(id); if (action === 'finish') timers.finish(id);
  const after = timers.list().find(t => t.id === id)!; previousTimers.set(id, { ...after });
  const event = action === 'reset' ? activityClientEvents.resetTimer(after.label, after.seconds) : action === 'start' && before.status === 'stopped' ? activityClientEvents.startedTimer(after.label, after.seconds) : timerTransitionEvent(before, after);
  c.localEvent(event ?? `Simulated ${action} for ${after.label}.`); tick();
}
function render() {
  if (config) { const selected = config.providers.find(p => p.id === c.provider)!; byId('mode').textContent = c.provider === 'mock' ? 'MOCK · NO MODEL CALLS' : selected.enabled ? 'LIVE WHEN SENT' : 'SETUP / BLOCKED'; byId('provider-description').textContent = selected.message; byId('consent-wrap').hidden = c.provider === 'mock' || !selected.enabled; byId('consent-label').textContent = c.provider === 'claude-cli' ? 'Use my subscription quota on Send/Retry; I reviewed the host-policy limits.' : 'Use my API budget on Send/Retry.'; byId<HTMLInputElement>('consent').checked = c.consent; byId<HTMLButtonElement>('send').disabled = !selected.enabled || (c.provider !== 'mock' && !c.consent) || paused; byId('mock-controls').hidden = c.provider !== 'mock'; byId('sample').hidden = c.provider !== 'mock'; }
  byId('send').textContent = c.pending ? 'Send update ↗' : 'Send ↗'; byId<HTMLButtonElement>('cancel').disabled = !c.pending; byId('pending').hidden = !c.pending; byId('status').textContent = c.pending ? 'Thinking… type an update to interrupt' : c.error ? 'Needs attention' : 'Ready when you are'; byId('error').hidden = !c.error; byId('error-message').textContent = c.error;
  const chatStatus = byId('aira-chat-status');
  if (chatStatus) {
    chatStatus.textContent = c.pending ? 'Thinking…' : paused ? 'Paused' : 'Coach Aira · Active';
  }
  airaCoach.onConversationPending(c.pending);
  const transcript = byId('transcript'); transcript.replaceChildren(); if (!c.events.length) transcript.append(el('p', 'Type "Let\'s go!" to start the 12-screen ENERGIZE workout, or click "Load wiring sample" for the generic fixture.', 'micro'));
  for (const event of c.events) { if (event.kind === 'input' || event.kind === 'response') { const n = el('div', '', 'message ' + (event.kind === 'input' ? 'user' : 'assistant')); n.append(el('span', event.kind === 'input' ? 'You' : 'Reply', 'who'), el('p', event.text ?? splitReply(event.result!.turn.reply).prose ?? '')); transcript.append(n); } else if (event.text) transcript.append(el('p', event.text, 'event')); else if (event.kind === 'interrupted' || event.kind === 'cancelled') transcript.append(el('p', event.kind === 'interrupted' ? 'Previous reply interrupted. Your messages are kept.' : 'Reply cancelled.', 'event')); }
  transcript.scrollTop = transcript.scrollHeight; syncTimers();
  const screens = c.document.screens, index = screens.findIndex(s => s.key === c.document.cursor), key = c.document.echo() + String(paused);
  if (key !== renderKey || !byId('screen').childNodes.length) {
    stopAndCleanupVideo();
    voiceCoach.cancel();
    airaCoach.destroyScreenAvatar();
    renderKey = key; updates = []; const surface = byId('screen'); surface.replaceChildren(); const current = c.document.current;
    if (!current) {
      surface.className = '';
      airaCoach.setScreen('');
      const n = el('div', '', 'empty'); n.append(el('p', 'A BLANK CANVAS, WITH THE WIRING DONE', 'eyebrow'), el('h3', 'Your workout starts here.'), el('p', 'Type "Let\'s go!" in the message box to start ENERGIZE, or click "Load wiring sample" below.')); surface.append(n);
    } else {
      const isWorkoutActive = (current.props.children as StatementNode[]).some(node => node.name === 'Video');
      surface.className = isWorkoutActive ? 'workout-active-screen' : '';
      airaCoach.setScreen(current.key);

      if (current.key === 's_welcome') {
        surface.append(airaCoach.createWelcomeCompanion(() => send("Let's go!")));
      } else if (current.key.includes('intro')) {
        const roundTitle = current.key.includes('round1') ? 'Round 1' : 'Round 2';
        surface.append(airaCoach.createIntroCoachCard(roundTitle));
      } else if (current.key === 's_rest') {
        surface.append(airaCoach.createRestCoachCard());
      } else if (current.key === 's_done') {
        surface.append(airaCoach.createDoneCoachCard());
      }

      for (const node of current.props.children as StatementNode[]) {
        if (node.name !== 'Cue') {
          if (isWorkoutActive && node.name === 'Alert') {
            surface.append(airaCoach.createWorkoutCoachCard(String(node.props.text), node.key));
          } else {
            surface.append(renderComponent(node, { send, timers, timerAction, updates, paused }));
          }
        }
      }
    }
    const progress = byId('progress'); progress.replaceChildren(); if (screens.length > 1) for (let i = 0; i < screens.length; i++) { const n = el('span', '', '' + (i === index ? 'active' : i < index ? 'past' : '')); n.setAttribute('aria-label', `Screen ${i + 1}${i === index ? ', current' : ''}`); progress.append(n); }
  }
  byId('navigation').hidden = screens.length < 2; byId('position').textContent = `${index + 1} / ${screens.length}`; byId<HTMLButtonElement>('back').disabled = paused || index <= 0; byId<HTMLButtonElement>('next').disabled = paused; byId('next').textContent = index === screens.length - 1 ? 'Finish preview' : 'Next →';
  byId<HTMLButtonElement>('pause').disabled = !screens.length; byId('pause').textContent = paused ? 'Resume preview' : 'Pause preview'; byId('paused').hidden = !paused;
  const cues = (c.document.current?.props.children as StatementNode[] ?? []).filter(n => n.name === 'Cue').map(n => String(n.props.text));
  const spokenText = cues.join(' ') || c.document.prose || '';
  byId('spoken').textContent = spokenText || 'Current-screen Cues appear here as text.';
  if (c.document.current && !paused) {
    voiceCoach.speakForScreen(c.document.cursor, spokenText);
  }
  byId('state-json').textContent = JSON.stringify({ ui_state: c.document.echo(), client_events: c.clientEvents, timers: timers.list() }, null, 2); byId<HTMLButtonElement>('export').disabled = c.pending || !c.events.length;
}
byId<HTMLFormElement>('composer').addEventListener('submit', event => { event.preventDefault(); const text = draft.value.trim(); if (text) { draft.value = ''; send(text); } });
draft.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); byId<HTMLFormElement>('composer').requestSubmit(); } });
byId('sample').addEventListener('click', () => send('Load wiring sample')); byId('cancel').addEventListener('click', () => c.cancel()); byId('retry').addEventListener('click', () => { if (!paused) void c.retry(); });
byId('reset').addEventListener('click', () => { stopAndCleanupVideo(); voiceCoach.reset(); airaCoach.reset(); nav.dispose(); paused = false; pausedTimers = []; timers.forget(); previousTimers.clear(); draft.value = ''; c.reset(); });
byId('back').addEventListener('click', () => { voiceCoach.cancel(); airaCoach.destroyScreenAvatar(); nav.back(); }); byId('next').addEventListener('click', () => { voiceCoach.cancel(); airaCoach.destroyScreenAvatar(); nav.next(); });
byId('pause').addEventListener('click', () => {
  paused = !paused;
  if (paused) {
    voiceCoach.cancel();
    airaCoach.pause();
    pausedTimers = timers.list().filter(t => t.status === 'running').map(t => t.id);
    for (const id of pausedTimers) timers.pause(id);
  } else {
    airaCoach.resume();
    for (const id of pausedTimers) timers.start(id);
    pausedTimers = [];
  }
  c.localEvent(paused ? 'User paused the preview.' : 'User resumed the preview.');
  tick();
});
byId<HTMLSelectElement>('provider').addEventListener('change', event => c.selectProvider((event.target as HTMLSelectElement).value as Provider));
byId<HTMLInputElement>('consent').addEventListener('change', event => { c.consent = (event.target as HTMLInputElement).checked; if (!c.consent) c.cancel(); render(); });
byId('apply-patch').addEventListener('click', () => { try { const raw = byId<HTMLTextAreaElement>('patch').value; c.document.apply(raw.includes('```') ? raw : '```openui\n' + raw + '\n```'); c.localEvent('Builder applied local OpenUI data: ' + raw); byId('patch-status').textContent = 'Patch accepted. This is local fixture evidence, not a model run.'; } catch { byId('patch-status').textContent = 'Invalid patch. Previous screen kept. Check names, arguments and catalog.'; } });
byId('export').addEventListener('click', () => { const label = byId<HTMLSelectElement>('run-label').value; const payload = { format: 'aira-workout-run-v1', label, appVersion: APP_VERSION, schemaVersion: SCHEMA_VERSION, selectedProvider: c.provider, note: byId<HTMLTextAreaElement>('note').value, events: c.events, state: { ui_state: c.document.echo(), client_events: c.clientEvents }, timers: timers.list() }; const url = URL.createObjectURL(new Blob([JSON.stringify(redactValue(payload), null, 2)], { type: 'application/json' })); const link = el('a'); link.href = url; link.download = label + '.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); byId('export-status').textContent = `Downloaded ${label}.json. Review and move it into runs/.`; });
async function start() {
  const chatAvatar = byId('aira-chat-avatar');
  if (chatAvatar) {
    airaCoach.initChatAvatar(chatAvatar);
  }
  voiceCoach.setSpeechCallbacks(
    () => airaCoach.onSpeechStart(),
    () => airaCoach.onSpeechEnd()
  );
  const voiceToggle = byId<HTMLInputElement>('voice-toggle');
  const voiceLabel = byId<HTMLElement>('voice-label');
  const voiceToggleWrap = voiceToggle?.closest('.voice-toggle');
  if (!voiceCoach.isSupported()) {
    if (voiceToggle) { voiceToggle.disabled = true; voiceToggle.checked = false; }
    if (voiceLabel) voiceLabel.textContent = 'Voice: N/A';
    voiceToggleWrap?.classList.add('is-unavailable');
  } else if (voiceToggle) {
    voiceToggle.checked = false;
    voiceToggle.addEventListener('change', () => {
      const on = voiceToggle.checked;
      voiceCoach.setEnabled(on);
      if (voiceLabel) voiceLabel.textContent = on ? 'Voice: ON' : 'Voice: OFF';
      voiceToggleWrap?.classList.toggle('is-active', on);
      if (on && c.document.current) {
        const cues = (c.document.current.props.children as StatementNode[] ?? []).filter(n => n.name === 'Cue').map(n => String(n.props.text));
        voiceCoach.speakForScreen(c.document.cursor, cues.join(' ') || c.document.prose || '');
      }
    });
  }
  render();
  try {
    const response = await fetch('/api/config');
    if (!response.ok) throw new Error();
    config = await response.json();
    const select = byId<HTMLSelectElement>('provider');
    select.replaceChildren();
    for (const p of config!.providers) {
      const option = el('option', p.label + (p.enabled ? '' : ' · setup / blocked'));
      option.value = p.id;
      select.append(option);
    }
    select.value = 'mock';
    select.disabled = false;
    render();
  } catch {
    byId('status').textContent = 'Could not connect. Restart the local server and reload.';
  }
}
setInterval(tick, 250); void start();
