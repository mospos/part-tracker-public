/* eslint-disable linebreak-style */
module.exports = {
  // Generates a dynamic URL to the main Ferguson site.
  // @params {string} partNum - The part number of identifier
  // (on Ferguson the partNum is not used but it is put there to conform
  // to other websites which need it).
  // @returns {string} - The generated URL for the part number
  gotoUrl: () => 'https://www.ferguson.com',
  // Selector for the search box element on page
  // @type {string}
  searchBoxSelector: '.search-field',
  // Represents the CSS selector for the search page element
  // @type {string}
  onSearchPage: '.search-results',
  // Represents the CSS selector for the product page element
  // @type {string}
  onProductPage: '.product-detail',
  // Retrieves product details from a web page.
  // @param {Object} page - The web page object.
  // @returns {Promise<void>} - A promise that resolves when the product details are retrieved.
  async getProductDetails(page) {
    // Waits for title element to appear before retrieving data
    await page.waitForSelector('.product-name');
    // Retrieves the name of the product from the specified element on the page.
    // @param {string} selector - The CSS selector for the element containing the product name.
    // @returns {Promise<string>} A Promise that resolves with the name of the product.
    const prodName = await page.$eval('.product-name', (pName) => pName.innerText);
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
  // @param {Page} page - The page object to be used for retrieving the product number.
  // @returns {Promise<string>} A promise that resolves with the product number.
  async getProductNumber(page) {
    // Retrieves the product number asynchronously using the provided 'page'
    // @param {string} selector - The CSS selector for the element containing the product number.
    // @returns {Promise<string>} A Promise that resolves with the product number.
    return page.$eval('.js-sku', (num) => num.innerText);
  },
  // Function to return the correc link from search page that matches part number
  // @params {Page} page - The page object to be used for retrieving url to go to from search page
  // @params {string} partNumber - The part number to match to correct URL.
  // @returns {Promise<string>} A promise that resolves with the correct URL.
  async correctLink(page, partNumber) {
    // @params {string} selector - The CSS selector for the element containing all hrefs.
    // @returns {Promise{Array}} A Promise that resolves with a list of all the
    // links for products on the page
    const allLinks = await page.$$eval('.c-product-tile a', (l) => l.map((hr) => hr.href));
    // Finds the correct link that has matching partNumber in it and return the URL
    // @params {string} partNumber - part number to match the URL
    return allLinks.find((link) => link.includes(`/${partNumber}.`));
  },
  // @params {Page} page - The page object to be used
  // @returns {Promise<string>} A Promise tht resolves with the text of
  //  "no results" from search page
  async noResultsFromSearchPage(page) {
    // @params {string} selector - The CSS selector for the element containing
    // element for no results on page.
    // @returns {Promise<string>} A Promise that resolves with string of text on page.
    return page.$eval('.c-search__result-heading', (res) => res.innerText);
  },
};
