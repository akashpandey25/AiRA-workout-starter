import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://avatars.bible-strong.app/');
await page.waitForTimeout(2000);

// Navigate to Export tab
const exportTab = page.locator('button:has-text("Export")');
await exportTab.click();
await page.waitForTimeout(1000);

// Click "Copy JSON" or extract from localStorage / page state
const state = await page.evaluate(async () => {
  // Check localStorage
  const keys = Object.keys(localStorage);
  const localData = {};
  for (const k of keys) {
    try {
      localData[k] = JSON.parse(localStorage.getItem(k));
    } catch {
      localData[k] = localStorage.getItem(k);
    }
  }
  return { localData, keys };
});

console.log('localStorage keys:', state.keys);

// Click Copy JSON and read clipboard
await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
const copyBtn = page.locator('button:has-text("Copy JSON")');
if (await copyBtn.isVisible()) {
  await copyBtn.click();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  await writeFile('scratch/copied_avatar.json', text);
  console.log('Saved copied_avatar.json, length:', text.length);
}

// Also check the JavaScript export tab
const jsTab = page.locator('button:has-text("JavaScript")');
if (await jsTab.isVisible()) {
  await jsTab.click();
  await page.waitForTimeout(500);
  const code = await page.locator('pre, code').allTextContents();
  console.log('JS tab code snippet:', code);
}

await browser.close();
