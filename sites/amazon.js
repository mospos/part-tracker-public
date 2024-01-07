/* eslint-disable linebreak-style */
module.exports = {
  // Generates a dynamic URL to the main amazon site.
  // @params {string} partNum - The part number of identifier
  // (on amazon the partNum is not used but it is put there to conform to other
  // eslint-disable-next-line linebreak-style
  // websites which need it).
  // @returns {string} - The generated URL for the part number
  // eslint-disable-next-line linebreak-style
  gotoUrl: () => 'https://www.amazon.com',
  // Selector for the search box element on page
  // @type {string}
  searchBoxSelector: '#twotabsearchtextbox',
  // Represents the CSS selector for the search page element
  // @type {string}
  onSearchPage: '.s-search-results',
  // Represents the CSS selector for the product page element
  // @type {string}
  onProductPage: '.product-title-word-break',
  // Retrieves product details from a web page.
  // @param {Object} page - The web page object.
  // @returns {Promise<void>} - A promise that resolves when the product details are retrieved.
  async getProductDetails(page) {
    // Waits for title element to appear before retrieving data
    await page.waitForSelector('.product-title-word-break');
    // Retrieves the name of the product from the specified element on the page.
    // @param {string} selector - The CSS selector for the element containing the product name.
    // @returns {Promise<string>} A Promise that resolves with the name of the product.
    const prodName = await page.$eval('.product-title-word-break', (el) => el.innerText);
    // Retrieves the product number asynchronously using the provided 'page' from
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
    await page.waitForSelector('#ASIN');
    // Retrieves the product number asynchronously using the provided 'page'
    // @param {string} selector - The CSS selector for the element containing the product number.
    // @returns {Promise<string>} A Promise that resolves with the product number.
    return page.$eval('#ASIN', (el) => el.value);
  },
  // @param {Page} page - The page object to be used for retrieving url to go to from search page
  // @param {string} partNumber - The part number to match to correct URL.
  // @returns {Promise<string>} A promise that resolves with the correct URL.
  async correctLink(page, partNumber) {
    // @params {string} selector - The CSS selector for the element containing all hrefs.
    // @returns {Promise{Array}} A Promise that resolves with a list of all the links
    // for products on the page.

    const links = await page.$$eval('.a-link-normal', (el) => el.map((l) => l.href));

    // @params {string} partNumber - part number to match the URL
    return links.find((link) => link.includes(`/dp/${partNumber}`));
  },
  noResultsFromSearchPage(page) {
    // @params {string} selector - The CSS selector for the element containing
    // element for no results on page.
    // @returns {Promise<string>} A Promise that resolves with string of text on page.

    return page.$eval('.s-search-results', (el) => el.innerText);
  },
};
