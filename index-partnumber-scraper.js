/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
const puppeteer = require('puppeteer');
const fsPromises = require('fs/promises');
const searchWithPartNumber = require('./partNumberScraper');
const websites = require('./sites');
const itemList = require('./parts-data');

const targetSites = [
  websites.chadwell,
  websites.ferguson,
  websites.hdsupply,
  websites.homedepot,
  websites.lowes,
  websites.amazon,
  websites.lowespro,
  websites.supplyhouse,
];
itemList.sortedPartNumbers.shift();

let newArrofObj = [];
(async function main() {
  let beginingNumber = 0;
  let endingNumber = 10;
  const browser = await puppeteer.launch();
  while (endingNumber < itemList.sortedPartNumbers.length) {
    const currentArr = itemList.sortedPartNumbers.slice(beginingNumber, endingNumber);
    for (const item of currentArr) {
      for (const target of targetSites) {
        const foundItem = await searchWithPartNumber(item[0], target, browser);
        if (foundItem) {
          foundItem.timesPurchased = item[1];
          newArrofObj.push(foundItem);
        }
      }
    }
    beginingNumber += 10;
    endingNumber += 10;
    if (newArrofObj.length > 30) {
      // convert my object to array in order to convert to csv file
      const converObjToArr = newArrofObj
        .map(({
          name, url, partnumber, timesPurchased,
        }) => ([name, url, partnumber, timesPurchased]));
      newArrofObj = [];
      // Add top row to csv file
      converObjToArr.unshift(['partName', 'partUrl', 'partNumber', 'timesPurchased']);
      // convert array to csv formula
      const csvData = converObjToArr.map((d) => d.join(',')).join('\n');

      await fsPromises.appendFile('./files/updated-orders-list.csv', csvData, (err) => {
        if (err) { console.log(err); } else {
          console.log('Success');
        }
      });
    }
  }
  await browser.close();
}());
