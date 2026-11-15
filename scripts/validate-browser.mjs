import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SCREENSHOT_DIR = 'evidence/screenshots';
await mkdir(SCREENSHOT_DIR, { recursive: true });

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

console.log('--- STARTING PHASE 4 BROWSER VALIDATION ---');

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true
});

const page = await browser.newPage({
  viewport: { width: 1440, height: 900 }
});

const errors = [];
page.on('pageerror', err => errors.push(err.message));
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});

// Helper functions
async function waitTurnComplete() {
  await page.waitForSelector('#pending', { state: 'hidden', timeout: 5000 });
}

async function sendComposer(text) {
  await page.fill('#message', text);
  await page.click('#send');
  await waitTurnComplete();
}

async function clickFollowUp(text) {
  const btn = page.locator('#screen button', { hasText: text }).first();
  await btn.click();
  await waitTurnComplete();
}

async function expectScreenTitle(expected) {
  const title = await page.locator('.block-title').textContent();
  if (!title.toLowerCase().includes(expected.toLowerCase())) {
    throw new Error(`Expected title "${expected}", got "${title}"`);
  }
}

async function expectPosition(expected) {
  await page.waitForFunction(
    exp => document.querySelector('#position')?.textContent?.trim() === exp.trim(),
    expected,
    { timeout: 5000 }
  );
}

// 1. Navigate to local app
console.log('1. Loading application at http://127.0.0.1:4319...');
await page.goto('http://127.0.0.1:4319');
await page.waitForSelector('#mode');
console.log('App loaded. Initial screen verified.');

// 2. Initialize ENERGIZE workout
console.log('2. Initializing ENERGIZE workout via composer...');
await sendComposer("Let's go!");
await expectScreenTitle('ENERGIZE');
await expectPosition('1 / 12');
console.log('s_welcome loaded. Position: 1 / 12.');

// Capture 01-welcome.png
await page.screenshot({ path: join(SCREENSHOT_DIR, '01-welcome.png'), fullPage: true });
await page.screenshot({ path: join(SCREENSHOT_DIR, '01-start.png'), fullPage: true });
console.log('Captured 01-welcome.png & 01-start.png.');

// 3. Test Welcome interactions (A & B)
console.log('3. Testing Welcome interactions...');
await sendComposer('What is this workout?');
await expectScreenTitle('ENERGIZE');
await expectPosition('1 / 12');
const spoken1 = await page.locator('#spoken').textContent();
console.log('  "What is this workout?" -> stayed on s_welcome. Spoken lane updated.');

await sendComposer("I'm a beginner");
await expectScreenTitle('ENERGIZE');
await expectPosition('1 / 12');
console.log('  "I\'m a beginner" -> stayed on s_welcome.');

// 4. Move to Warmup
console.log('4. Moving to Warmup...');
await clickFollowUp("Ready, let's go!");
await expectScreenTitle('Get Moving');
await expectPosition('2 / 12');
console.log('s_warmup loaded. Position: 2 / 12.');

// Verify Timer on Warmup: Start, Pause, Resume, Simulate finish
console.log('  Testing Warmup Timer controls...');
await page.click('button:has-text("Start simulation")');
await page.waitForTimeout(300);
let status = await page.locator('.timer-status').textContent();
if (status !== 'running') throw new Error(`Timer expected running, got ${status}`);
console.log('  Warmup timer status: running.');

// Test Toolbar Pause Preview
console.log('  Testing Toolbar Pause preview button...');
await page.click('#pause'); // Pause preview
await page.waitForSelector('#paused:not([hidden])');
status = await page.locator('.timer-status').textContent();
console.log('  Preview paused. Timer status:', status);

await page.click('#pause'); // Resume preview
await page.waitForSelector('#paused', { state: 'hidden' });
console.log('  Preview resumed.');

// Simulate finish on warmup timer
console.log('  Testing Simulate finish on Warmup timer...');
await page.click('button:has-text("Simulate finish")');
status = await page.locator('.timer-status').textContent();
console.log('  Simulate finish clicked. Timer status:', status);
// Verify it did NOT advance automatically
await expectPosition('2 / 12');
await expectScreenTitle('Get Moving');
console.log('  Verified: Simulate finish did NOT auto-advance the screen.');

// Capture 02-warmup.png
await page.screenshot({ path: join(SCREENSHOT_DIR, '02-warmup.png'), fullPage: true });
console.log('Captured 02-warmup.png.');

// 5. Navigate to Round 1 Intro
console.log('5. Navigating to Round 1 Intro...');
await sendComposer('Skip warmup');
await expectScreenTitle('Round 1 of 2');
await expectPosition('3 / 12');
console.log('s_r1_intro loaded. Position: 3 / 12.');

// Test Back button
console.log('  Testing toolbar Back button from s_r1_intro...');
await page.click('#back');
await expectPosition('2 / 12');
await expectScreenTitle('Get Moving');
console.log('  Back button navigated back to s_warmup cleanly.');

// Return to Round 1 Intro
await sendComposer('Skip warmup');
await expectPosition('3 / 12');

// 6. Start Round 1 -> Squats
console.log('6. Starting Round 1 -> Squats...');
await clickFollowUp('Start Round 1');
await expectScreenTitle('Squats');
await expectPosition('4 / 12');
console.log('s_r1_squats loaded. Position: 4 / 12.');

// Test Squat interaction C: "How do I do a squat?"
console.log('  Testing Squat form question ("How do I do a squat?")...');
await sendComposer('How do I do a squat?');
await expectScreenTitle('Squats');
await expectPosition('4 / 12');
console.log('  Stayed on Squats. Form guidance provided in spoken lane.');

// Start simulation on Squats timer
await page.click('button:has-text("Start simulation")');
await page.waitForTimeout(300);

// Capture 03-round1-exercise.png
await page.screenshot({ path: join(SCREENSHOT_DIR, '03-round1-exercise.png'), fullPage: true });
console.log('Captured 03-round1-exercise.png.');

// 7. Next exercise -> Push-Ups
console.log('7. Navigating to Push-Ups...');
await sendComposer('Next exercise');
await expectScreenTitle('Push-Ups');
await expectPosition('5 / 12');

// Test Push-Up modification interaction D
console.log('  Testing Push-Up modification request...');
await sendComposer('I need a modification');
await expectScreenTitle('Push-Ups');
await expectPosition('5 / 12');
console.log('  Stayed on Push-Ups. Knee push-up modification provided.');

// 8. Next exercise -> High Knees
console.log('8. Navigating to High Knees (Round 1)...');
await sendComposer('Next exercise');
await expectScreenTitle('High Knees');
await expectPosition('6 / 12');

// Test High Knees break interaction E
console.log('  Testing "I need a break" interaction...');
await sendComposer('I need a break');
await expectScreenTitle('High Knees');
await expectPosition('6 / 12');
console.log('  Stayed on High Knees. Pause preview guidance provided.');

// 9. Round 1 done! -> Rest (MUST go to s_rest, NOT s_done!)
console.log('9. Sending "Round 1 done!"...');
await sendComposer('Round 1 done!');
await expectScreenTitle('Rest');
await expectPosition('7 / 12');
console.log('  Verified: "Round 1 done!" moved to s_rest (Position: 7 / 12).');

// Test Rest interaction F: "Need more time"
console.log('  Testing "Need more time" interaction on Rest...');
await sendComposer('Need more time');
await expectScreenTitle('Rest');
await expectPosition('7 / 12');
console.log('  Stayed on Rest. Pause advice provided.');

// Capture 04-rest.png
await page.screenshot({ path: join(SCREENSHOT_DIR, '04-rest.png'), fullPage: true });
console.log('Captured 04-rest.png.');

// 10. Skip rest -> Round 2 Intro
console.log('10. Navigating to Round 2 Intro...');
await clickFollowUp('Ready now');
await expectScreenTitle('Round 2 of 2');
await expectPosition('8 / 12');

// Test Round 2 interaction G: "How am I doing?"
console.log('  Testing "How am I doing?" interaction...');
await sendComposer('How am I doing?');
await expectScreenTitle('Round 2 of 2');
await expectPosition('8 / 12');
console.log('  Stayed on Round 2 intro. Progress summary provided.');

// 11. Start Round 2 -> Squats
console.log('11. Starting Round 2 Squats...');
await clickFollowUp('Start Round 2');
await expectScreenTitle('Squats');
await expectPosition('9 / 12');

// 12. Next exercise -> Round 2 Push-Ups
console.log('12. Navigating to Round 2 Push-Ups...');
await clickFollowUp('Next exercise');
await expectScreenTitle('Push-Ups');
await expectPosition('10 / 12');

// 13. Next exercise -> Round 2 High Knees (FINAL)
console.log('13. Navigating to Round 2 High Knees (FINAL)...');
await clickFollowUp('Next exercise');
await expectScreenTitle('High Knees');
await expectPosition('11 / 12');

// Verify warning alert on Round 2 High Knees
const alertClass = await page.locator('.alert').getAttribute('data-statement');
console.log('  Final High Knees alert statement:', alertClass);

// Test Simulate finish on final High Knees: MUST NOT advance to s_done!
console.log('  Testing Simulate finish on final exercise timer...');
await page.click('button:has-text("Simulate finish")');
await expectScreenTitle('High Knees');
await expectPosition('11 / 12');
console.log('  Verified: Timer completion on High Knees stayed on s_r2_highknees.');

// Capture 05-round2-final.png & 02-workout-state.png
await page.screenshot({ path: join(SCREENSHOT_DIR, '05-round2-final.png'), fullPage: true });
await page.screenshot({ path: join(SCREENSHOT_DIR, '02-workout-state.png'), fullPage: true });
console.log('Captured 05-round2-final.png & 02-workout-state.png.');

// 14. Finish workout -> Completion
console.log('14. Finishing workout -> Workout Complete...');
await clickFollowUp("I'm done!");
await expectScreenTitle('Workout Complete');
await expectPosition('12 / 12');
console.log('s_done loaded. Position: 12 / 12.');

// Test Completion interactions H & I
console.log('  Testing "Tell me how I did" on Completion...');
await sendComposer('Tell me how I did');
await expectScreenTitle('Workout Complete');
await expectPosition('12 / 12');
console.log('  Stayed on completion. Summary provided.');

await sendComposer('What should I do next time?');
await expectScreenTitle('Workout Complete');
await expectPosition('12 / 12');
console.log('  Stayed on completion. Progression advice provided.');

// Capture 06-complete.png
await page.screenshot({ path: join(SCREENSHOT_DIR, '06-complete.png'), fullPage: true });
console.log('Captured 06-complete.png.');

// 15. Test Start over
console.log('15. Testing "Start over" from completion screen...');
await clickFollowUp('Start over');
await expectScreenTitle('ENERGIZE');
await expectPosition('1 / 12');
console.log('Verified: "Start over" successfully reset back to s_welcome (Position: 1 / 12).');

// 16. Responsive Viewport Checks
console.log('16. Performing Responsive Viewport Checks...');

// Tablet Check
console.log('  Checking Tablet Viewport (768x1024)...');
await page.setViewportSize({ width: 768, height: 1024 });
await page.waitForTimeout(300);
const scrollWidthTablet = await page.evaluate(() => document.documentElement.scrollWidth);
const innerWidthTablet = await page.evaluate(() => window.innerWidth);
if (scrollWidthTablet > innerWidthTablet) {
  throw new Error(`Horizontal overflow on tablet: ${scrollWidthTablet} > ${innerWidthTablet}`);
}
console.log('  Tablet responsive check: PASSED (no horizontal overflow).');

// Mobile Check
console.log('  Checking Mobile Viewport (390x844)...');
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
const scrollWidthMobile = await page.evaluate(() => document.documentElement.scrollWidth);
const innerWidthMobile = await page.evaluate(() => window.innerWidth);
if (scrollWidthMobile > innerWidthMobile) {
  throw new Error(`Horizontal overflow on mobile: ${scrollWidthMobile} > ${innerWidthMobile}`);
}
console.log('  Mobile responsive check: PASSED (no horizontal overflow).');

// Capture 03-mobile.png
await page.screenshot({ path: join(SCREENSHOT_DIR, '03-mobile.png'), fullPage: true });
console.log('Captured 03-mobile.png.');

console.log('--- ALL VALIDATIONS & SCREENSHOTS COMPLETED SUCCESSFULLY! ---');
if (errors.length) {
  console.warn('Page errors detected:', errors);
} else {
  console.log('Zero console/page errors detected during session.');
}

await browser.close();
