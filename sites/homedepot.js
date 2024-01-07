/* eslint-disable linebreak-style */
module.exports = {
  // Generates a dynamic URL to the main Home Depot site.
  // @params {string} partNum - The part number of identifier
  // @returns {string} - The generated URL for the part number
  gotoUrl: (partNum) => `https://www.homedepot.com/s/${partNum}?NCNI-5`,
  // Represents the CSS selector for the search page element
  // @type {string}
  onSearchPage: '.results-header',
  // Represents the CSS selector for the product page element
  // @type {string}
  onProductPage: '.product-details',
  // Represents the CSS selector for the no results page element
  // @type {string}
  noResultsPage: '.no-results-found',
  // Retrieves product details from a web page.
  // @param {Object} page - The web page object.
  // @returns {Promise<void>} - A promise that resolves when the product details are retrieved.
  async getProductDetails(page) {
    // Waits for title element to appear before retrieving data
    await page.waitForSelector('.product-details__badge-title--wrapper');
    // Retrieves the name of the product from the specified element on the page.

    // @param {string} selector - The CSS selector for the element containing the product name.
    // @returns {Promise<string>} A Promise that resolves with the name of the product.
    const prodName = await page.$eval('.product-details__badge-title--wrapper', (el) => el.innerText);
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
  // Retrieves product number from website page
  // @param {Page} page - The page object to be used for retrieving the product number.
  // @returns {Promise<string>} A promise that resolves with the product number.
  async getProductNumber(page) {
    // Waits for element to appear before retrieving data.
    await page.waitForSelector('.sui-font-normal');
    // Retrieves the product number asynchronously using the provided 'page'
    // @param {string} selector - The CSS selector for the element containing the product number.
    // @returns {Promise<string>} A Promise that resolves with the product number.
    return page.$eval('.sui-font-normal', (el) => el.innerText);
  },
  // @param {Page} page - The page object to be used for retrieving url to go to from search page
  // @param {string} partNumber - The part number to match to correct URL.
  // @returns {Promise<string>} A promise that resolves with the correct URL.
  async correctLink(page, partNumber) {
    // @returns {Promise{Array}} A Promise that resolves with a list of all
    // the links for products on the page.
    const links = await page.$$eval('.pod-spacer__top--dgy0w a', (l) => l.map((a) => a.href));
    // Finds the correct link that has matching partNumber in it and return the URL
    // @params {string} partNumber - part number to match the URL
    return links.find((l) => l.includes(`/${partNumber}`));
  },
};
