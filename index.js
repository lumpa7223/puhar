const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const fs = require('fs');
const os = require('os');
const moment = require('moment');
const { extractDataFromPerformanceTiming } = require('./helpers');

(async () => {
    // headless: false --- will open browser
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    const har = new PuppeteerHar(page);
    //await har.start({ path: 'results1.har' });
    await har.start();
    await page.goto(process.argv[2]);

    const performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    const measureTime = extractDataFromPerformanceTiming(
        performanceTiming,
        'responseEnd',
        'domInteractive',
        'domContentLoadedEventEnd',
        'loadEventEnd'
    );

    const ret = await har.stop();

    ret['log']['pages'].forEach((x) => {
        x['pageTimings'] = {
            "onContentLoad": measureTime['domContentLoadedEventEnd'],
            "onLoad": measureTime['loadEventEnd'],
        }
    });

    const fname = moment().format('YYYY-MM-DD_HH_mm_ss');
    fs.writeFileSync(`${fname}.har`, JSON.stringify(ret) + os.EOL);

    await browser.close();
})();
