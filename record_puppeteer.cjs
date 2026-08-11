const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Starting Puppeteer Demo Recorder...');
  
  const framesDir = path.join(__dirname, 'frames');
  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(framesDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  let frameIdx = 0;
  const captureInterval = 200; // ms per frame (5 fps)

  async function snap(durationMs = 400) {
    const steps = Math.max(1, Math.floor(durationMs / captureInterval));
    for (let i = 0; i < steps; i++) {
      const fileName = path.join(framesDir, `frame_${String(frameIdx).padStart(5, '0')}.png`);
      await page.screenshot({ path: fileName, type: 'png' });
      frameIdx++;
      await new Promise(r => setTimeout(r, captureInterval));
    }
  }

  async function clickButtonWithText(matchText) {
    const clicked = await page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find(b => b.textContent && b.textContent.includes(text));
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, matchText);
    console.log(`Click button "${matchText}": ${clicked}`);
    return clicked;
  }

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await snap(1200);

  // 1. Sector Overview
  console.log('Capturing Sector Overview...');
  await page.mouse.move(500, 350);
  await snap(1500);

  // Search interaction
  const searchInput = await page.$('input[placeholder*="Search"]');
  if (searchInput) {
    await searchInput.type('World Wildlife', { delay: 80 });
    await snap(1000);
    await page.keyboard.press('Escape');
    await snap(500);
  }

  // 2. Scorecard View
  console.log('Capturing Scorecard View...');
  await clickButtonWithText('Balanced 990 Scorecard');
  await snap(2000);

  // Scroll down slightly
  await page.evaluate(() => window.scrollBy(0, 250));
  await snap(1500);

  // 3. Scorecard Architect Agent
  console.log('Capturing Scorecard Architect Agent...');
  await clickButtonWithText('Scorecard Architect Agent');
  await snap(2000);

  // Move sliders
  const sliders = await page.$$('input[type="range"]');
  if (sliders.length >= 2) {
    await page.evaluate(el => { el.value = 40; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, sliders[0]);
    await snap(1200);
    await page.evaluate(el => { el.value = 10; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, sliders[1]);
    await snap(1500);
  }

  // 4. Governance Risk Radar
  console.log('Capturing Governance Risk Radar...');
  await clickButtonWithText('990 Governance Risk Radar');
  await snap(1800);

  // 5. Consensus Debate
  console.log('Capturing Consensus Debate...');
  await clickButtonWithText('Multi-Agent Debate Panel');
  await snap(1800);

  // 6. Impact Calculator & DONATE
  console.log('Capturing Impact Calculator & DONATE Action...');
  await clickButtonWithText('Impact Allocation Calculator');
  await snap(1500);

  // Click DONATE
  await clickButtonWithText('DONATE');
  await snap(2500);

  // 7. Donor Memory Bank
  console.log('Capturing Donor Portfolio & Memory...');
  await clickButtonWithText('Donor Portfolio & Memory');
  await snap(3000);

  await browser.close();
  console.log(`Finished recording! Total frames captured: ${frameIdx}`);
})();
