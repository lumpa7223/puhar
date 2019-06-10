const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const har = new PuppeteerHar(page);
    await har.start({ path: 'results.har' });

    await page.goto(process.argv[2]);

    await har.stop();
    await browser.close();
})();