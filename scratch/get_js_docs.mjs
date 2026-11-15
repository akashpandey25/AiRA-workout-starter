import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://avatars.bible-strong.app/');
await page.waitForTimeout(2000);

// Navigate to Export tab
const exportTab = page.locator('button:has-text("Export")');
await exportTab.click();
await page.waitForTimeout(1000);

// Click JavaScript / ESM
const jsBtn = page.getByRole('button', { name: 'JavaScript / ESM Runtime JSON' });
await jsBtn.click();
await page.waitForTimeout(1000);

const pres = await page.locator('pre').allTextContents();
console.log('=== PRE TAGS IN JS EXPORT ===');
pres.forEach((p, i) => console.log(`[${i}]:\n${p}\n`));

const texts = await page.locator('.export-accordion-trigger, section, main').allTextContents();
console.log('=== TEXT CONTENT ===\n', texts[0]?.slice(0, 1000));

await browser.close();
