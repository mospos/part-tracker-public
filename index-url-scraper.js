/* eslint-disable linebreak-style */
const puppeteer = require('puppeteer');
const fsPromises = require('fs/promises');
const searchWithUrl = require('./urlscraper');
const itemList = require('./parts-data');

itemList.urlArr.shift();
const testArr = [];
for (let i = 0; i < 10; i++) {
  testArr.push(itemList.urlArr[i]);
}

const arrOfObj = [];
(async function main() {
  const browser = await puppeteer.launch();
  for (const item of testArr) {
    const page = await browser.newPage();
    const data = await searchWithUrl(item[0], page);
    if (data) {
      data.timesPurchased = item[1];
      arrOfObj.push(data);
    }
  }
  console.log(arrOfObj)
  // convert my object to array in order to convert to csv file
  const converObjToArr = arrOfObj
    .map(({
      name, url, partnumber, timesPurchased,
    }) => ([name, url, partnumber, timesPurchased]));
    // Add top row to csv file
  converObjToArr.unshift(['partName', 'partUrl', 'partNumber', 'timesPurchased']);
  // convert array to csv formula
  const csvData = converObjToArr.map((d) => d.join(',')).join('\n');

  await fsPromises.appendFile('./files/updated-url-list.csv', csvData, (err) => {
    if (err) { console.log(err); } else {
      console.log('Success');
    }
  });
  await browser.close();
}());
