/* eslint-disable linebreak-style */
/* eslint-disable radix */
/* eslint-disable linebreak-style */
module.exports = {
  // Generates a dynamic URL to the main Chadwell site.
  // @params {string} partNum - The part number of identifier
  // (on Chadwell the partNum is not used but it is put there to conform
  // to other websites which need it).
  // @returns {string} - The generated URL for the part number
  // eslint-disable-next-line no-unused-vars
  gotoUrl: () => 'https://www.chadwellsupply.com',
  // Selector for the search box element on page
  // @type {string}
  searchBoxSelector: '.search-box',
  // Represents the CSS selector for the search page element
  // eslint-disable-next-line linebreak-style
  // @type {string}
  onSearchPage: '.summary',
  // Represents the CSS selector for the product page element
  // @type {string}

  onProductPage: '.desktop-product-details',
  // Retrieves product details from a web page.
  // @param {Object} page - The web page object.
  // @returns {Promise<void>} - A promise that resolves when the product details are retrieved.

  async getProductDetails(page) {
    // Waits for title element to appear before retrieving data
    await page.waitForSelector('.product-title h1');
    // Retrieves the name of the product from the specified element on the page.
    // @param {string} selector - The CSS selector for the element containing the product name.
    // @returns {Promise<string>} A Promise that resolves with the name of the product.
    const prodName = await page.$eval('.product-title h1', (prod) => prod.innerText);
    // Retrieves the product number asynchronously using the provided 'page'
    // from function getProductNumber
    // @param {Page} page - The page object to be used for retrieving the product number.
    // @returns {Promise<string>} A promise that resolves with the product number.
    const prodNum = await this.getProductNumber(page);
    return {
      name: prodName,
      url: page.url(),
      partnumber: prodNum,
    };
  },
  // Retrieves product number from web page
  // @param {Page} page - The page object to be used for retrieving the product number.
  // @returns {Promise<string>} A promise that resolves with the product number.
  async getProductNumber(page) {
    // Waits for element to appear before retrieving data.
    await page.waitForSelector('.no-break');
    // Retrieves the product number asynchronously using the provided 'page'
    // @param {string} selector - The CSS selector for the element containing the product number.
    // @returns {Promise<string>} A Promise that resolves with the product number.
    // eslint-disable-next-line no-use-before-define
    return page.$eval('.no-break', (num) => splitString(num.innerText));
  },
  // Retreives url from the search page that matches the part number
  // @param {Page} page - The page object to be used for retrieving url to go to from search page
  // @param {string} partNumber - The part number to match to correct URL.
  // @returns {Promise<string>} A promise that resolves with the correct URL.
  async correctLink(page, partNumber) {
    // @params {string} selector - The CSS selector for the element containing all hrefs.
    // @returns {Promise{Array}} A Promise that resolves with a list of all the part
    // numbers (not hrefs like other sites) for products on the page.
    // .slice() is used to return just the part number without preceding words
    const allPartNumbersFromWebPage = await page.$$eval('.no-break.float-left', (el) => el.map((prtN) => prtN.innerText).map((n) => n.slice(6)));
    // Find part number that matched one in array and return it
    const matchingPartNumber = allPartNumbersFromWebPage.find((num) => num === partNumber);
    /// / @param {Page} page - The page object to be used to find correct URL that
    // matched the part number
    const pathname = await page.$eval(`[data-item-sku="${matchingPartNumber}"]`, (el) => el.getAttribute('href'));
    return `https://chadwellsupply.com${pathname}`;
  },

  // @params {Page} page - The page object to be used
  // returns {Promise<string>}  A Promise tht resolves with the text of
  // "no results" from search page
  async noResultsFromSearchPage(page) {
    // @params {string} selector - The CSS selector for the element containing
    // element for no results on page.
    // @returns {Promise<string>} A Promise that resolves with string of text on page.
    return page.$eval('.summary > strong', (res) => parseInt(res.innerText));
  },
};
async function splitString(str) {
  return str.replace(/[^0-9.]+/g, '');
}
