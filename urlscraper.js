/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable linebreak-style */
const puppeteer = require('puppeteer');
const websites = require('./sites');

async function scrapeSites(scrapeUrl, page) {
    console.log(`site: ${scrapeUrl}`);
    /* exposes the function to split part numbers that come back with a
        string preceding the part number */
    await page.exposeFunction('splitString', splitString);
    try {
        if (scrapeUrl.includes('amazon') || scrapeUrl.includes('//a.co/')) {
            await page.goto(scrapeUrl);
            return await websites.amazon.getProductDetails(page);
        }
        if (scrapeUrl.includes('chadwell')) {
            await page.goto(scrapeUrl);
            return await websites.chadwell.getProductDetails(page);
        }
        if (scrapeUrl.includes('ferguson')) {
            await page.goto(scrapeUrl);
            return await websites.ferguson.getProductDetails(page);
        }
        if (scrapeUrl.includes('hdsupply')) {
            await page.goto(scrapeUrl);
            return await websites.hdsupply.getProductDetails(page);
        }
        if (scrapeUrl.includes('homedepot')) {
            await page.goto(scrapeUrl);
            return await websites.homedepot.getProductDetails(page);
        }
        if (scrapeUrl.includes('lowespro')) {
            await page.goto(scrapeUrl);
            return await websites.lowespro.getProductDetails(page);
        }
        if (scrapeUrl.includes('lowes.com')) {
            await page.goto(scrapeUrl);
            return await websites.lowes.getProductDetails(page);
        }
        if (scrapeUrl.includes('supplyhouse')) {
            await page.goto(scrapeUrl);
            return await websites.supplyhouse.getProductDetails(page);
        }
    } catch (e) {
        console.log(e.message);
    }
    return false;
}

async function splitString(str) {
    return str.replace(/[^0-9.]+/g, '');
}
module.exports = scrapeSites;
