/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable no-use-before-define */
/* eslint-disable linebreak-style */
module.exports = {
  // Generates a dynamic URL to the main HD Supply site.
  // @params {string} partNum - The part number of identifier
  // @returns {string} - The generated URL for the part number
  gotoUrl: () => 'https://hdsupplysolutions.com',
  // Selector for the search box element on page
  // @type {string}

  searchBoxSelector: '.search__input',
  // Represents the CSS selector for the search page element
  // @type {string}
  onSearchPage: '.subcat-header__result-count',
  // Represents the CSS selector for the product page element
  // @type {string}
  onProductPage: '.product-detail__description',
  // Represents the CSS selector for the no results page element
  // @type {string}
  noResultsPage: '.search-result',

  // Retrieves product details from a web page.
  // @param {Object} page - The web page object.
  // @returns {Promise<void>} - A promise that resolves when the product details are retrieved.
  async getProductDetails(page) {
    // Waits for title element to appear before retrieving data
    await page.waitForSelector('.product-detail__description');
    // Retrieves the name of the product from the specified element on the page.
    // @param {string} selector - The CSS selector for the element containing the product name.
    // @returns {Promise<string>} A Promise that resolves with the name of the product.
    const prodName = await page.$eval('.type--body-medium h1', (prodN) => prodN.innerText);
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
    // Retrieves the product number asynchronously using the provided 'page'
    // @param {string} selector - The CSS selector for the element containing the product number.
    // @returns {Promise<string>} A Promise that resolves with the product number.

    return page.$eval('.pdp-product-info-left', (el) => splitString(el.innerText));
  },
  // @param {Page} page - The page object to be used for retrieving url to go to from search page
  // @param {string} partNumber - The part number to match to correct URL.
  // @returns {Promise<string>} A promise that resolves with the correct URL.
  async correctLink(page, partNumber) {
    // @params {string} selector - The CSS selector for the element containing all hrefs.
    // @returns {Promise{Array}} A Promise that resolves with a list of
    // all the links for products on the page.
    const links = await page.$$eval('.subcat-grid-tile a', (l) => l.map((a) => a.href));
    // Finds the correct link that has matching partNumber in it and return the URL
    // @params {string} partNumber - part number to match the URL
    return links.find((l) => l.includes(`-p${partNumber}`));
  },
  // @params {Page} page - The page object to be used
  // @returns {Promise<string>} A Promise tht resolves with the text of "no results"
  // from search page
  async noResultsFromSearchPage(page) {
    // @params {string} selector - The CSS selector for the element containing
    // element for no results on page.
    // @returns {Promise<string>} A Promise that resolves with string
    return page.$eval('.alert-box.alert-box--info', (mess) => mess.innerText);
  },
};
async function splitString(str) {
  return str.replace(/[^0-9.]+/g, '');
}
