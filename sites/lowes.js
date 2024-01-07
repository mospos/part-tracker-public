/* eslint-disable linebreak-style */
module.exports = {
  // Generates a dynamic URL to the search page of Lowes site.
  // @params {string} partNum - The part number of identifier
  // @returns {string} - The generated URL for the part number
  gotoUrl: (partNum) => `https://lowes.com/search?searchTerm=${partNum}`,
  // Represents the CSS selector for the search page element
  // @type {string}
  onSearchPage: '[data-selector="splp-prd-lst-ttl"]',
  // Represents the CSS selector for the product page element
  // @type {string}
  onProductPage: '.styles__H1-sc-11vpuyu-0',
  // Represents the CSS selector for the no results page element
  // @type {string}
  noResultsPage: '.noresults-recommendations',

  // @param {Page} page - The page object to be used for retrieving url to go to from search page
  // @param {string} partNumber - The part number to match to correct URL.
  // @returns {Promise<string>} A promise that resolves with the correct URL.
  async correctLink(page, productNumber) {
    await page.waitForSelector('.tile_group a');
    // @params {string} selector - The CSS selector for the element containing all hrefs.
    // @returns {Promise{Array}} A Promise that resolves with a list of all
    //  the links for products on the page.
    let myLink = '';
    const allHrefs = await page.$$eval('.tile_group a', (value) => value.map((hr) => hr.href));
    const productLinks = allHrefs.filter((v) => v.includes('/pd/'));
    // Filter out the links that are doubled through a function getUniqueLinks
    // @params {Array} of links
    // @returns {Array} of unique strings (urls)
    // eslint-disable-next-line no-use-before-define
    const uniqueLinks = getUniqueLinks(productLinks);
    // loops over Array of links goes to url and searches the product page for the part number
    // as there is no part number on the search page

    for (const link of uniqueLinks) {
      await page.goto(link);
      // retrieve product number from site
      // @param {Page} page - The page object to be used for retrieving the product number.
      // @returns {Promise<string>} A promise that resolves with the product number.
      const prodNumber = await this.getProductNumber(page);
      // check if product number from page matched part number from list
      if (prodNumber === productNumber) {
        myLink = page.url();
      }
    }
    return myLink;
  },
  // Retrieves product details from a web page.
  // @param {Object} page - The web page object.
  // @returns {Promise<void>} - A promise that resolves when the product details are retrieved.
  async getProductDetails(page) {
    await page.waitForSelector('.styles__H1-sc-11vpuyu-0');
    // Retrieves the name of the product from the specified element on the page.
    // @param {string} selector - The CSS selector for the element containing the product name.
    // @returns {Promise<string>} A Promise that resolves with the name of the product.
    const prodName = await page.$eval('.styles__H1-sc-11vpuyu-0', (el) => el.innerText);
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
    await page.waitForSelector('.styles__ParagraphRegular-sc-1ljw3tp-0.small');
    // Retrieves the product number asynchronously using the provided 'page'
    // @param {string} selector - The CSS selector for the element
    // containing the product number.
    // @returns {Promise<string>} A Promise that resolves with the product number.
    // eslint-disable-next-line no-use-before-define
    return page.$eval('.styles__ParagraphRegular-sc-1ljw3tp-0.small', (el) => splitString(el.innerText));
  },
};
function getUniqueLinks(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
async function splitString(str) {
  return str.replace(/[^0-9.]+/g, '');
}
