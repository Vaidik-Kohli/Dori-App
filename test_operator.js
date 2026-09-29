const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const targetUrl = 'file:///' + path.resolve('operator-console.html').replace(/\\/g, '/');
    await page.goto(targetUrl);
    
    // Switch to dark mode (operator-console uses localStorage or we can click toggle)
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('Dori-theme', 'dark');
    });
    
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'playwright-screenshot-operator-dark.png', fullPage: true });
    console.log('Screenshot saved to playwright-screenshot-operator-dark.png');
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
