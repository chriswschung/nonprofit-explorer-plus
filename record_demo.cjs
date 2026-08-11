const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching browser for demo recording...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const videoDir = path.join(__dirname, 'recordings');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 800 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Sector Overview (Bubble chart)
  console.log('1. Sector Overview...');
  await page.mouse.move(500, 350);
  await page.waitForTimeout(2000);

  // 2. Scorecard View
  console.log('2. Scorecard View...');
  await page.click('button:has-text("Scorecard Summary"), nav button:has-text("Scorecard")');
  await page.waitForTimeout(2500);

  // 3. Scorecard Architect Agent
  console.log('3. Scorecard Architect Agent...');
  await page.click('button:has-text("Scorecard Architect")');
  await page.waitForTimeout(2500);

  // Adjust sliders
  const sliders = await page.$$('input[type="range"]');
  if (sliders.length > 0) {
    await sliders[0].fill('40');
    await page.waitForTimeout(1200);
  }
  if (sliders.length > 1) {
    await sliders[1].fill('10');
    await page.waitForTimeout(1200);
  }

  // 4. Governance Risk Radar
  console.log('4. Risk Radar...');
  await page.click('button:has-text("Risk Radar")');
  await page.waitForTimeout(2000);

  // 5. Multi-Agent Debate
  console.log('5. Consensus Debate...');
  await page.click('button:has-text("Consensus Debate")');
  await page.waitForTimeout(2000);

  // 6. Impact Calculator
  console.log('6. Impact Calculator & DONATE...');
  await page.click('button:has-text("Impact Calculator")');
  await page.waitForTimeout(2000);

  // Click DONATE button
  const donateBtn = await page.$('button:has-text("DONATE"), button:has-text("Pledge")');
  if (donateBtn) {
    await donateBtn.click();
    console.log('Clicked DONATE!');
    await page.waitForTimeout(2500);
  }

  // 7. Donor Memory Bank
  console.log('7. Donor Memory Bank...');
  await page.click('button:has-text("Memory Bank")');
  await page.waitForTimeout(3000);

  console.log('Closing browser to flush video file...');
  const videoPath = await page.video().path();
  await page.close();
  await context.close();
  await browser.close();

  console.log('Raw recorded video file:', videoPath);

  const destPath = path.join(videoDir, 'demo_raw.webm');
  fs.copyFileSync(videoPath, destPath);
  console.log('Saved video to:', destPath);
})();
