/* eslint-disable linebreak-style */
module.exports = {
  // Generates a dynamic URL to the main Lowes Pro site.
  // @params {string} partNum - The part number of identifier
  // @returns {string} - The generated URL for the part number
  gotoUrl: (partNum) => `https://www.lowesprosupply.com/search?criteria=${partNum}`,
  // Represents the CSS selector for the search page element
  // @type {string}
  onSearchPage: '.product-list.category-list',
  // Represents the CSS selector for the product page element
  // @type {string}
  onProductPage: '#tst_productDetail_shortDescription',
  // @params {Page} page - The page object to be used
  // @returns {Promise<string>} A Promise tht resolves with the text
  //  of "no results" from search page
  async noResultsFromSearchPage(page) {
    // @params {string} selector - The CSS selector for the element containing
    // element for no results on page.
    // @returns {Promise<string>} A Promise that resolves with string of text on page.
    return page.$eval('.search-lbl', (el) => el.innerText);
  },
  // @param {Page} page - The page object to be used for retrieving url to go to from search page
  // @param {string} partNumber - The part number to match to correct URL.
  // @returns {Promise<string>} A promise that resolves with the correct URL.
  async correctLink(page, partNumber) {
    await page.waitForSelector('.item-name a');
    // @params {string} selector - The CSS selector for the element containing all hrefs.
    // @returns {Promise{Array}} A Promise that resolves with a list of all the links
    // for products on the page.
    const getHref = await page.$$eval('.item-name a', (el) => el.map((getLink) => getLink.href));
    // Finds the correct link that has matching partNumber in it and return the URL
    // @params {string} partNumber - part number to match the URL
    return getHref.find((l) => l.includes(`-${partNumber}`));
  },
  // Retrieves product details from a web page.
  // @param {Object} page - The web page object.
  // @returns {Promise<void>} - A promise that resolves when the product details are retrieved.
  async getProductDetails(page) {
    // Waits for title element to appear before retrieving data
    await page.waitForSelector('#tst_productDetail_shortDescription');
    // Retrieves the name of the product from the specified element on the page.
    // @param {string} selector - The CSS selector for the element containing the product name.
    // @returns {Promise<string>} A Promise that resolves with the name of the product
    const prodName = await page.$eval('#tst_productDetail_shortDescription', (el) => el.innerText);
    // Retrieves the product number asynchronously using the provided
    // 'page' from function getProductNumber
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
    await page.waitForSelector('.item-num');
    // Retrieves the product number asynchronously using the provided 'page'
    // @param {string} selector - The CSS selector for the element containing the product number.
    // @returns {Promise<string>} A Promise that resolves with the product number.
    return page.$eval('.item-num', (el) => el.innerText);
  },
};
