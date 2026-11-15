import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const runtimeCode = readFileSync('scratch/avatar-runtime-bundled.js', 'utf8');
const avatarJson = JSON.parse(readFileSync('scratch/copied_avatar.json', 'utf8'));

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setContent(`
  <!doctype html>
  <html>
    <body>
      <div id="avatar-container"></div>
    </body>
  </html>
`);

// Inject bundle and run createAvatar
const result = await page.evaluate(async ({ code, definition }) => {
  // Create an ESM blob URL
  const blob = new Blob([code], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const { createAvatar } = await import(url);
  
  const container = document.getElementById('avatar-container');
  const controller = createAvatar(container, {
    definition,
    defaultAnimation: 'idle',
    size: 200,
  });

  const svg = container.querySelector('svg');
  const initialPaths = Array.from(svg.querySelectorAll('path')).map(p => p.getAttribute('d')?.slice(0, 30));
  
  // Wait 100ms for animation frames
  await new Promise(r => setTimeout(r, 200));
  const animatedPaths = Array.from(svg.querySelectorAll('path')).map(p => p.getAttribute('d')?.slice(0, 30));

  // Change expression
  const expRes = controller.setExpression('joyful-wide');
  const stateAfterExp = controller.getState();

  // Play animation
  const animRes = controller.play('celebrate');
  const stateAfterAnim = controller.getState();

  return {
    hasSvg: !!svg,
    viewBox: svg.getAttribute('viewBox'),
    initialPathsCount: initialPaths.length,
    expRes,
    stateAfterExp,
    animRes,
    stateAfterAnim,
    pathChanges: initialPaths.some((p, i) => p !== animatedPaths[i]),
  };
}, { code: runtimeCode, definition: avatarJson });

console.log('Browser test result:\n', JSON.stringify(result, null, 2));

await browser.close();
