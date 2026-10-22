import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
const localBrowser = `${process.env.LOCALAPPDATA}/ms-playwright/chromium-1243/chrome-win64/chrome.exe`;
const browser = await chromium.launch({ headless: true, ...(existsSync(localBrowser) ? { executablePath: localBrowser } : {}) });
const base = process.env.SITE_URL || 'http://127.0.0.1:4187';
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(e.message));
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => document.querySelectorAll('#feature-board .square').length === 64);
    await page.waitForTimeout(400);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Horizontal overflow at ${width}px`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.match(await page.title(), /Outpost/);
  }
  for (const mode of ['puzzle', 'review', 'play']) {
    await page.locator(`[data-mode=${mode}]`).click();
    assert.equal(await page.locator(`[data-mode=${mode}]`).getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#feature-board .square').count(), 64);
  }
  for (const key of ['sicilian', 'queens', 'french', 'italian']) {
    await page.locator(`[data-opening=${key}]`).click();
    assert.equal(await page.locator('#opening-content').getAttribute('aria-labelledby'), `opening-${key}`);
    assert.equal(await page.locator('#opening-board .square').count(), 64);
  }
  await page.locator('[data-opening=italian]').focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('[data-opening=sicilian]').getAttribute('aria-selected'), 'true');
  for (const details of await page.locator('details').all()) {
    await details.locator('summary').click();
    assert.equal(await details.evaluate(el => el.open), true);
  }
  for (const link of await page.locator('.apk-link').all()) assert.match(await link.getAttribute('href'), /releases\/latest\/download\/outpost-1\.0\.0-android-arm64\.apk$/);
  const release = await (await page.request.get(`${base}/release.json`)).json();
  assert.ok(release.sizeBytes > 80000000);
  assert.match(release.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(await page.evaluate(() => [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src)), []);
  for (const path of ['/credits.html', '/assets/CHESSNUT-LICENSE.txt', '/assets/chess-art.png']) assert.equal((await page.request.get(base + path)).status(), 200);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  assert.equal(await page.locator('.hero-art').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('.reveal').first().evaluate(el => getComputedStyle(el).opacity), '1');
  assert.deepEqual(errors, []);
  console.log('PASS: 5 responsive sizes, 7 feature/opening tabs, keyboard navigation, 5 FAQs, download metadata, assets, reduced motion and no browser errors.');
} finally { await browser.close(); }
