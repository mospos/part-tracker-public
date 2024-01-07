/* eslint-disable linebreak-style */
module.exports = {
  // Generates a dynamic URL to the supply house site.
  // @params {string} partNum - The part number of identifier
  // @returns {string} - The generated URL for the part number
  gotoUrl: (partNum) => `https://www.supplyhouse.com/sh/control/search/~SEARCH_STRING=${partNum}`,
  // Represents the CSS selector for the search page element
  // @type {string}
  onSearchPage: '.ProductListingPageHeader__ProductListingPageHeaderTitleContainer-sc-1movb3z-1',
  // Represents the CSS selector for the product page element
  // @type {string}
  onProductPage: '.ProductPageContainerRight-sc-7gb3ga-0',
  // Represents the CSS selector for the no results page element
  // @type {string}
  noResultsPage: '.ProductListingPageSearchHeader__SearchStatusHeader-sc-1ln6t1u-0 > .kbDKga',
  // @param {Page} page - The page object to be used for retrieving url to go to from search page
  // @param {string} partNumber - The part number to match to correct URL.
  // @returns {Promise<string>} A promise that resolves with the correct URL.
  async correctLink(page, partNumber) {
    // @params {string} selector - The CSS selector for the element containing all hrefs.
    // @returns {Promise{Array}} A Promise that resolves with a list of all
    // the links for products on the page.
    const allLinks = await page.$$eval('.ProductTileName__ProductTileNameLink-sc-1fe0vqu-0', (link) => link.map((el) => el.href));
    // Finds the correct link that has matching partNumber in it and return the URL
    // @params {string} partNumber - part number to match the URL
    return allLinks.find((link) => link.includes(`-${partNumber}-`));
  },
  // Retrieves product details from a web page.
  // @param {Object} page - The web page object.
  // @returns {Promise<void>} - A promise that resolves when the product details are retrieved.
  async getProductDetails(page) {
    await page.waitForSelector('.Box-sc-1z9git-0');
    await page.waitForSelector('.iXetAF.cikMNG');
    // Retrieves the name of the product from the specified element on the page.
    // @param {string} selector - The CSS selector for the element containing the product name.
    // @returns {Promise<string>} A Promise that resolves with the name of the product.
    const prodName = await page.$eval('.Box-sc-1z9git-0 h1', (tel) => tel.innerText);
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
    // Retrieves the product number asynchronously using the provided 'page'
    // @param {string} selector - The CSS selector for the element containing the product number.
    // @returns {Promise<string>} A Promise that resolves with the product number.
    return page.$eval('.iXetAF.cikMNG', (pn) => pn.innerText);
  },
};
