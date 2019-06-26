const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const fs = require('fs');
const os = require('os');
const moment = require('moment');
const { extractDataFromPerformanceTiming } = require('./helpers');

(async (urls_arg) => {
    // headless: false --- will open browser
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-first-run', '--no-zygote', '--no-sandbox', '--disable-setuid-sandbox'] });
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36';
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);

    let urls = urls_arg.split(',')

    for (let i = 0; i < urls.length; i++) {
        const har = new PuppeteerHar(page);
        //await har.start({ path: 'results1.har' });
        await har.start();
        let target = urls[i].trim();

        try {
            await page.goto(target, { waitUntil: 'load', timeout: 60000 });
        } catch (e) {
            console.log(e);
            browser.close();
        }

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
        const url = target.split('//')[1];
        const fname = `${url}_${moment().format('YYYY-MM-DD_HH_mm_ss')}`;
        fs.writeFileSync(`./harfile/${fname}.har`, JSON.stringify(ret) + os.EOL);
    }

    await browser.close();
})(process.argv[2]);