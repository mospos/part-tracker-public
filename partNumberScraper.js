/* eslint-disable linebreak-style */
/* eslint-disable no-continue */

/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable no-return-await */
/* eslint-disable linebreak-style */
// This code is a web scraper using puppeteer.
// There is an array of part numbers received from monday.com.
// and this script is searching 8 websites where the part number may exsist.
// The code searches those sites and matches the part number with its specific name
// and url from the site it came from.
//
// Here is a high level breakdown of its functionality:
//
// 1. The script defines an array of part numbers and an array of target sites
// each with its specifications.
// For each target site, functions are defined to create the URL to be opened,
// detect if the script is
// on a search page or a product page, get product details, and perform few more tasks.
// depending on the site some go first to the main page and type into the search box,
// and some have the part number put into the url string.
// 2. A main async function searchAllSites is defined that loops over each part number
// in the array,
// and for each part number, it loops over each target site.
// 3. The script launches a browser instance using Puppeteer, navigates to each target site,
// and searches for each part from the part number list.
//  4. Depending on whether the page is identified as a search page or product page,
// different scraping strategies are applied. If on a search page,
// it tries to find the correct link for the product details and go to that link where
// it can receive he product details from.
// If on a product Page, it gets the product details right there.
// additionally some websites have no results page, if the the script reaches that page
// it just goes on to the next part number.
//  5. For each web page visited, a series of tasks are performed;
// including: checking if results exist for the search query,
// navigating to the correct link (if it exists), retrieving product details, etc.
//  6. Finally, there is a helper function getUniqueLinks defined at the end to get
// only unique links from an
// array of iterables (Mostly, links).
// This script uses functions from the Puppeteer library to perform tasks such as page navigation,
// input interactions, and page content extraction.
// The user-agent is randomly picked from a predefined list on each page navigation
// to mimic different browser's  behavior and possibly avoid being detected
// and blocked by anti-bot measures.

const puppeteer = require('puppeteer');
const userAgents = require('./userAgents');
const { correctLink } = require('./sites/amazon');

// Function that searches all the specified sites in
// searchTargets with the specified part number from arrOfNums
async function searchAllSites(partNumber, target, browser) {
  console.log(`Part Number: ${partNumber}`);
  console.log(`Target Site: ${target.gotoUrl(partNumber)}`);
  const page = await browser.newPage();
  // eslint-disable-next-line no-use-before-define
  await page.exposeFunction('splitString', splitString);
  // Generate random user agent from userAgents.js file
  const randomUA = userAgents.generateRandomUA();
  await page.setUserAgent(randomUA);
  // dummy counter
  let counter = 0;
  // placeholder
  let success = false;

  // start trying, up to 6 times
  while (counter < 5) {
    console.log('trying');
    try {
      success = await page.goto(target.gotoUrl(partNumber));
      // no errors
      if (success) {
        console.log(`got it on ${counter} try`);
        // get out of while loop, we're good
        break;
      }
    } catch (e) {
      console.log(e.message);
      // bump up counter so that it won't try again.
      counter++;
    }
  }

  // if after the while loop, success is still false
  if (!success) {
    console.log('sorry, ran into more than 5 errors, moving on');
    await page.close();
    return false;
  }
  // If target has a search box element first go there to type in part number
  if (target.searchBoxSelector) {
    await page.waitForSelector(target.searchBoxSelector);
    // Types into search box the part number
    await page.type(target.searchBoxSelector, `${partNumber}`);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
  }
  if (target.noResultsPage) {
    const noResultsPage = (await page.$(`${target.noResultsPage}`)) || false;
    if (noResultsPage) {
      // We hit no results, let's get out of this site
      await page.close();
      return false;
    }
    console.log(' We are not on the no results page, yay! ');
  }
  const onSearchPage = (await page.$(`${target.onSearchPage}`)) || false;
  const onProductPage = (await page.$(`${target.onProductPage}`)) || false;
  if (onProductPage) {
    try {
      const productDetails = await target.getProductDetails(page);
      if (productDetails.partnumber === partNumber) {
        console.log(productDetails);
        return {
          name: productDetails.name,
          url: productDetails.url,
          partnumber: productDetails.partnumber,
        };
      }
    } catch {
      console.log('not on product page');
      await page.close();
    }
  }
  // If on search page is true - we are on search page and look for specified selectors
  if (onSearchPage) {
    // If target site has noResultSearchPage look there first
    if (target.noResultsFromSearchPage) {
      try {
        // read results from that page
        const results = await target.noResultsFromSearchPage(page);
        // If results are 0, or string of 'No results' or "We're sorry"
        // means there are no results then close page and continue to next target site
        if (!results
          || results.includes('No results')
          || results.includes("We're sorry")) {
          console.log('no results');
          await page.close();
          return false;
        }
      } catch (e) {
        console.log('couldnt read results');
      }
    }
    try {
      // Find correct link from search page using target method
      const gotCorrectLink = await target.correctLink(page, partNumber);
      if (!correctLink) {
        return false;
      }
      if (gotCorrectLink) {
        await page.goto(gotCorrectLink);
        const productDetails = await target.getProductDetails(page);
        console.log(productDetails);
        await page.close();
        if (productDetails.partnumber !== partNumber) {
          console.log('doesnt match');
          return false;
        }
        if (productDetails.partnumber === partNumber) {
          console.log(productDetails);
          return {
            name: productDetails.name,
            url: productDetails.url,
            partnumber: productDetails.partnumber,
          };
        }
      }
    } catch {
      console.log('not on search page');
    }
  }
  if (page) {
    await page.close();
  }
  return false;
}

async function splitString(str) {
  return str.replace(/[^0-9.]+/g, '');
}

module.exports = searchAllSites;
