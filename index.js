const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const fs = require('fs');
const os = require('os');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    const har = new PuppeteerHar(page);
    //await har.start({ path: 'results1.har' });
    await har.start();
    await page.goto(process.argv[2]);

    const ret = await har.stop();
    fs.writeFileSync('results.har',JSON.stringify(ret)+os.EOL);

    await browser.close();
})();
