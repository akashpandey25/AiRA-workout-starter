import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const shots = 'evidence/screenshots';

async function send(page, text) {
  await page.locator('#message').fill(text);
  await page.locator('#send').click();
  await expect(page.locator('#pending')).toBeHidden();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#mode')).toHaveText('MOCK · NO MODEL CALLS');
  await mkdir(shots, { recursive: true });
});

test('complete 12-screen ENERGIZE workout flow with videos, timers, and Aira coaching', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // 1. Welcome screen
  await send(page, "Let's go!");
  await expect(page.locator('#position')).toHaveText('1 / 12');
  await expect(page.locator('[data-statement="w_title"]')).toContainText('ENERGIZE');
  await expect(page.locator('#spoken')).toContainText('Welcome to ENERGIZE');

  // Verify Aira chat avatar and welcome companion
  await expect(page.locator('#aira-chat-avatar svg')).toBeVisible();
  await expect(page.locator('#aira-chat-status')).toContainText('Coach Aira');
  await expect(page.locator('.aira-welcome-card')).toBeVisible();
  await expect(page.locator('.aira-welcome-card svg')).toBeVisible();
  await expect(page.locator('.aira-welcome-title')).toHaveText("Hey, I'm Aira. Ready to get moving?");
  await page.screenshot({ path: `${shots}/01-welcome.png`, fullPage: true });

  // Informational question stays on s_welcome
  await send(page, 'What is this workout?');
  await expect(page.locator('#position')).toHaveText('1 / 12');
  await expect(page.locator('.message.assistant').last()).toContainText('6-minute bodyweight circuit');

  // Advance to Warmup (screen 2)
  await page.getByRole('button', { name: "Got it — let's go!" }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('2 / 12');
  await expect(page.locator('[data-statement="wm_title"]')).toContainText('Get Moving');
  await expect(page.locator('.exercise-video-card')).toBeVisible();
  const warmupVideo = page.locator('.exercise-video-player');
  await expect(warmupVideo).toHaveAttribute('src', '/exercises/warmups.mp4');
  await expect(page.locator('.timer')).toBeVisible();
  await expect(page.locator('.timer strong')).toHaveText('0:45');

  // Verify Aira active coach card
  await expect(page.locator('.aira-coach-card')).toBeVisible();
  await expect(page.locator('.aira-coach-card svg')).toBeVisible();
  await expect(page.locator('.aira-coach-tag')).toHaveText('COACH AIRA · FORM CUE');
  await page.screenshot({ path: `${shots}/02-warmup.png`, fullPage: true });

  // Advance to Round 1 Intro (screen 3)
  await page.getByRole('button', { name: 'Skip warmup' }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('3 / 12');
  await expect(page.locator('[data-statement="r1i_title"]')).toContainText('Round 1 of 2');

  // Advance to Round 1 Squats (screen 4)
  await page.getByRole('button', { name: 'Start Round 1' }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('4 / 12');
  await expect(page.locator('[data-statement="sq1_title"]')).toContainText('Squats');

  // Video check for Squats
  const squatsVideo = page.locator('.exercise-video-player');
  await expect(page.locator('.exercise-video-card')).toBeVisible();
  await expect(squatsVideo).toHaveAttribute('src', '/exercises/squats.mp4');

  // Circular timer check
  await expect(page.locator('.timer strong')).toHaveText('0:40');
  await expect(page.locator('.timer-ring-indicator')).toBeVisible();

  // Test Timer Start & Pause
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await expect(page.locator('.timer-status')).toHaveText('running');
  await expect(page.locator('.timer')).toHaveClass(/is-running/);

  // Pause preview syncs video and timer
  await page.locator('#pause').click();
  await expect(page.locator('.timer-status')).toHaveText('paused');
  await expect(page.locator('#paused')).toBeVisible();
  await page.locator('#pause').click();
  await expect(page.locator('.timer-status')).toHaveText('running');
  await expect(page.locator('#paused')).toBeHidden();

  // Replay demo button
  const replayBtn = page.locator('.video-replay-btn');
  await expect(replayBtn).toBeVisible();
  await replayBtn.click();

  // Contextual question does not advance screen
  await send(page, 'How do I do a squat?');
  await expect(page.locator('#position')).toHaveText('4 / 12');
  await expect(page.locator('.message.assistant').last()).toContainText('hip-width apart');

  // Safety question
  await send(page, 'I feel dizzy');
  await expect(page.locator('#position')).toHaveText('4 / 12');
  await expect(page.locator('.message.assistant').last()).toContainText('stop exercising immediately');

  // Advance to Push-Ups (screen 5)
  await send(page, 'next exercise');
  await expect(page.locator('#position')).toHaveText('5 / 12');
  await expect(page.locator('[data-statement="pu1_title"]')).toContainText('Push-Ups');
  const pushupsVideo = page.locator('.exercise-video-player');
  await expect(pushupsVideo).toHaveAttribute('src', '/exercises/pushup.mp4');

  // Advance to High Knees (screen 6)
  await send(page, 'next exercise');
  await expect(page.locator('#position')).toHaveText('6 / 12');
  await expect(page.locator('[data-statement="hk1_title"]')).toContainText('High Knees');
  const highkneesVideo = page.locator('.exercise-video-player');
  await expect(highkneesVideo).toHaveAttribute('src', '/exercises/high-knees.mp4');
  await page.screenshot({ path: `${shots}/03-round1-exercise.png`, fullPage: true });

  // Advance to Rest (screen 7)
  await page.getByRole('button', { name: 'Round 1 done!' }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('7 / 12');
  await expect(page.locator('[data-statement="rest_title"]')).toContainText('Rest');
  await expect(page.locator('.timer strong')).toHaveText('1:00');
  await expect(page.locator('.aira-screen-coach.aira-screen-rest')).toBeVisible();
  await expect(page.locator('.aira-screen-coach.aira-screen-rest svg')).toBeVisible();
  await page.screenshot({ path: `${shots}/04-rest.png`, fullPage: true });

  // Skip rest to Round 2 Intro (screen 8)
  await page.getByRole('button', { name: "Skip rest — I'm ready" }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('8 / 12');
  await expect(page.locator('[data-statement="r2i_title"]')).toContainText('Round 2 of 2');

  // Round 2 Squats (screen 9)
  await page.getByRole('button', { name: 'Start Round 2' }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('9 / 12');
  await expect(page.locator('.exercise-video-player')).toHaveAttribute('src', '/exercises/squats.mp4');

  // Round 2 Push-Ups (screen 10)
  await page.getByRole('button', { name: 'Next exercise' }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('10 / 12');
  await expect(page.locator('.exercise-video-player')).toHaveAttribute('src', '/exercises/pushup.mp4');

  // Round 2 High Knees (screen 11)
  await page.getByRole('button', { name: 'Next exercise' }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('11 / 12');
  await expect(page.locator('.exercise-video-player')).toHaveAttribute('src', '/exercises/high-knees.mp4');
  await page.screenshot({ path: `${shots}/05-round2-final.png`, fullPage: true });

  // Completion (screen 12)
  await page.getByRole('button', { name: 'Finish workout' }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('12 / 12');
  await expect(page.locator('[data-statement="done_title"]')).toContainText('Workout Complete');
  await expect(page.locator('[data-statement="done_kw_rounds"]')).toContainText('2 / 2');
  await expect(page.locator('[data-statement="done_kw_ex"]')).toContainText('6');
  await expect(page.locator('.aira-screen-coach.aira-screen-done')).toBeVisible();
  await expect(page.locator('.aira-screen-coach.aira-screen-done svg')).toBeVisible();
  await page.screenshot({ path: `${shots}/06-complete.png`, fullPage: true });

  // Restart / Start over
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('1 / 12');
  await expect(page.locator('[data-statement="w_title"]')).toContainText('ENERGIZE');

  expect(errors).toEqual([]);
});

test('responsive layout verification across desktop, tablet, and mobile viewports', async ({ page }) => {
  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'laptop', width: 1024, height: 768 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await send(page, "Let's go!");
    await expect(page.locator('#position')).toHaveText('1 / 12');

    // Confirm zero horizontal scroll
    const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(noOverflow).toBe(true);

    // Navigate to warmup (2/12), then round 1 intro (3/12), then squats (4/12)
    await send(page, "Let's go!");
    await expect(page.locator('#position')).toHaveText('2 / 12');
    await send(page, 'skip warmup');
    await expect(page.locator('#position')).toHaveText('3 / 12');
    await send(page, 'start round 1');
    await expect(page.locator('#position')).toHaveText('4 / 12');
    await expect(page.locator('.exercise-video-card')).toBeVisible();

    const cardBox = await page.locator('.exercise-video-card').boundingBox();
    expect(cardBox).not.toBeNull();
    expect(cardBox.width).toBeLessThanOrEqual(vp.width);

    const timerBox = await page.locator('.timer').boundingBox();
    expect(timerBox).not.toBeNull();

    if (vp.width >= 1024) {
      // Two-column desktop layout: timer is side-by-side to the right of the video
      expect(timerBox.x).toBeGreaterThan(cardBox.x);
    } else {
      // Stacked on narrow screens
      expect(timerBox.y).toBeGreaterThan(cardBox.y);
    }

    const noOverflowOnExercise = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(noOverflowOnExercise).toBe(true);
  }
});

test('optional browser-based voice coaching toggle, cues, cancel on navigation/reset/off', async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    window.__cancelled = 0;
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: (utterance) => {
          window.__spoken.push(utterance.text);
        },
        cancel: () => {
          window.__cancelled++;
        },
        getVoices: () => [],
      },
      configurable: true,
      writable: true,
    });
  });

  await page.goto('/');

  // Verify toggle exists and defaults to OFF
  const toggle = page.locator('#voice-toggle');
  const label = page.locator('#voice-label');
  await expect(toggle).toBeVisible();
  await expect(toggle).not.toBeChecked();
  await expect(label).toHaveText('Voice: OFF');

  // Navigate without voice coaching -> no speech synthesized
  await send(page, "Let's go!");
  await expect(page.locator('#position')).toHaveText('1 / 12');
  let spokenCount = await page.evaluate(() => window.__spoken.length);
  expect(spokenCount).toBe(0);

  // Turn voice coaching ON
  await toggle.check();
  await expect(label).toHaveText('Voice: ON');
  let lastSpoken = await page.evaluate(() => window.__spoken[window.__spoken.length - 1]);
  expect(lastSpoken).toContain('Welcome to ENERGIZE');

  // Verify duplicate prevention on same screen: state or DOM updates do not re-speak
  await send(page, 'What is this workout?');
  await expect(page.locator('#position')).toHaveText('1 / 12');
  const spokenAfterQuestion = await page.evaluate(() => window.__spoken.length);
  expect(spokenAfterQuestion).toBe(1);

  // Navigate to Warmup (Screen 2)
  await page.getByRole('button', { name: "Got it — let's go!" }).click();
  await expect(page.locator('#position')).toHaveText('2 / 12');
  const cancelledCount = await page.evaluate(() => window.__cancelled);
  expect(cancelledCount).toBeGreaterThan(0);
  lastSpoken = await page.evaluate(() => window.__spoken[window.__spoken.length - 1]);
  expect(lastSpoken).toContain('Warmup time');

  // Toggle voice coaching OFF -> cancels pending speech
  await toggle.uncheck();
  await expect(label).toHaveText('Voice: OFF');
  const cancelAfterOff = await page.evaluate(() => window.__cancelled);
  expect(cancelAfterOff).toBeGreaterThan(cancelledCount);

  // Navigate to Round 1 Intro (Screen 3) with Voice OFF -> no new speech
  const countBeforeOffNav = await page.evaluate(() => window.__spoken.length);
  await page.getByRole('button', { name: 'Skip warmup' }).click();
  await expect(page.locator('#position')).toHaveText('3 / 12');
  const countAfterOffNav = await page.evaluate(() => window.__spoken.length);
  expect(countAfterOffNav).toBe(countBeforeOffNav);

  // Reset run cancels any voice coaching
  await toggle.check();
  await expect(label).toHaveText('Voice: ON');
  await page.locator('#reset').click();
  await expect(page.locator('#screen')).toContainText('Your workout starts here');
  const cancelledAfterReset = await page.evaluate(() => window.__cancelled);
  expect(cancelledAfterReset).toBeGreaterThan(cancelAfterOff);
});

test('Aira avatar procedural SVG geometry, expressiveness, thinking and pause synchronization', async ({ page }) => {
  // 1. Initial state: chat avatar is present with procedural SVG
  const chatAvatarSvg = page.locator('#aira-chat-avatar svg');
  await expect(chatAvatarSvg).toBeVisible();
  await expect(chatAvatarSvg).toHaveAttribute('viewBox', '-150 -150 300 300');
  await expect(chatAvatarSvg.locator('circle, path')).not.toHaveCount(0);
  await expect(page.locator('#aira-chat-status')).toContainText('Coach Aira');

  // 2. Start workout: welcome companion card contains Aira SVG avatar
  await send(page, "Let's go!");
  await expect(page.locator('#position')).toHaveText('1 / 12');
  const welcomeAvatarSvg = page.locator('.aira-welcome-card svg');
  await expect(welcomeAvatarSvg).toBeVisible();
  await expect(welcomeAvatarSvg).toHaveAttribute('viewBox', '-150 -150 300 300');
  await expect(page.locator('.aira-welcome-title')).toHaveText("Hey, I'm Aira. Ready to get moving?");

  // 3. Pause preview triggers paused status
  await page.locator('#pause').click();
  await expect(page.locator('#aira-chat-status')).toHaveText('Paused');
  await expect(page.locator('#paused')).toBeVisible();

  // Resume preview
  await page.locator('#pause').click();
  await expect(page.locator('#aira-chat-status')).toContainText('Coach Aira');
  await expect(page.locator('#paused')).toBeHidden();

  // 4. Conversation question updates without breaking avatar
  await page.locator('#message').fill('What is this workout?');
  await page.locator('#send').click();
  await expect(page.locator('#pending')).toBeHidden();
  await expect(page.locator('#position')).toHaveText('1 / 12');

  // 5. Navigate to active workout (Warmup): active coach card renders with SVG avatar
  await send(page, "Let's go!");
  await expect(page.locator('#position')).toHaveText('2 / 12');
  const workoutAvatarSvg = page.locator('.aira-coach-card svg');
  await expect(workoutAvatarSvg).toBeVisible();
  await expect(page.locator('.aira-coach-tag')).toHaveText('COACH AIRA · FORM CUE');

  // 6. Reset run cleans up screen avatar and preserves chat avatar
  await page.locator('#reset').click();
  await expect(page.locator('#screen')).toContainText('Your workout starts here');
  await expect(page.locator('.aira-coach-card')).toBeHidden();
  await expect(chatAvatarSvg).toBeVisible();
});


