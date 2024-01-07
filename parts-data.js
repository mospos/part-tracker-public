/* eslint-disable no-continue */
/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
const fs = require('fs');
const path = require('path');
const removeWordsFunction = require('./removeWordsFunction');

const filePath = path.join(__dirname, 'data', 'randomized-data.json');
const fileData = fs.readFileSync(filePath);

const orderData = JSON.parse(fileData);
const itemsArrayOfObj = [];
const tempArrOfObj = [];

for (const data of orderData) {
  const columnValues = data.column_values;
  let partId = '';
  let orderNumber;
  for (const colv of columnValues) {
    if (colv.id === 'text9') {
      partId = colv.text;
    }
    if (colv.id === 'text3') {
      const removeWords = removeWordsFunction.forOrderNumbers(colv.text);
      if (removeWords.includes('/')) {
        orderNumber = removeWords.split('/');
      } else {
        orderNumber = removeWords;
      }
    }
  }
  tempArrOfObj.push({ partId, orderNumber });
}

for (const item of tempArrOfObj) {
  // If item exsists in array just update the array
  const exsists = itemsArrayOfObj.find((el) => el.partId === item.partId);
  if (exsists) {
    exsists.timesPurchased++;
    exsists.orderNumbers.push(item.orderNumber);
  }
  if (!exsists) {
    const timesPurchased = 1;
    const orderNumbers = [item.orderNumber];
    // Add my object to items array: the partId the times purchased and the array of order
    // numbers - the reason I need an array is because there can be multiple times
    // the item was purchased and we want an array of all the order numbers of that item.
    itemsArrayOfObj.push({ partId: item.partId, timesPurchased, orderNumbers });
  }
}
const filteredItemsArr = itemsArrayOfObj.filter((el) => el.orderNumbers[0] !== '');
// Convert Array of Objects to Array of Arrays
const newArrOfArr = filteredItemsArr
  .map(({
    partId, timesPurchased, orderNumbers,
  }) => ([partId, timesPurchased, orderNumbers]));
const urlArr = [];
const partNumberArr = [];
// Split up array of part numbers and array for urls
for (const data of newArrOfArr) {
  if (data[0].includes('https')) {
    urlArr.push(data);
  } else {
    partNumberArr.push(data);
  }
}
// Remove part numbers that have more then 25 digits (sentences)
const removeSentences = partNumberArr.filter((el) => el[0].length < 25);
// Remove unnecessary wording in part numbers
const justPartNumbers = removeSentences
  .map((el) => [removeWordsFunction.forPartNumbers(el[0]), el[1], el[2]]);

// remove all empty part id or order numbers from array
const filteredArray = justPartNumbers.filter((item) => item[0] !== '');

// Flatten Array Order Numbers Array
filteredArray.forEach((el) => el.flat());
urlArr.forEach((el) => el.flat());
// module.exports = { finalFlattenedArrayOfPartNumbers, finalFlattenedArrayOfUrls };

// Code to write to csv file
const csvHeading = ['partId', 'timesPurchased', 'orderNumbers'];
filteredArray.unshift(csvHeading);
const csvDataForPartNumbers = filteredArray.map((d) => d.join(',')).join('\n');
fs.writeFile('./files/part-data-test.csv', csvDataForPartNumbers, (err) => {
  if (err) { console.log(err); } else {
    console.log('Success');
  }
});
urlArr.unshift(csvHeading);
const csvDataForUrls = urlArr.map((d) => d.join(',')).join('\n');
fs.writeFile('./files/part-data-with-urls.csv', csvDataForUrls, (err) => {
  if (err) { console.log(err); } else {
    console.log('Success');
  }
});
