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

// Set up download listener
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.locator('button:has-text("Download React demo (.zip)")').click(),
]);

const path = await download.path();
console.log('Downloaded path:', path);
const stream = await download.createReadStream();
const chunks = [];
for await (const chunk of stream) chunks.push(chunk);
const buffer = Buffer.concat(chunks);
await writeFile('scratch/react-demo.zip', buffer);
console.log('Saved scratch/react-demo.zip, size:', buffer.length);

await browser.close();
