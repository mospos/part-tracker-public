/* eslint-disable linebreak-style */
// Function to remove words from user input of part numbers without removing letters
// from part number itself
function forPartNumbers(txt) {
  const removeWordsArray = [
    'Chadwell', 'Home Depot', 'HD', 'Ferguson', 'Part', '#', 'Order', 'no', 'number', 'sams', 'club',
    'Lowes', 'Supply', 'Item', 'Model', ':', 'Lowespro', '-', 'Amazon', 'case', 'Manufacturer',
    ' ', '"', 'fergunso', '/', 'WHITE', '12x6', '4x10', 'J&W', 'inch', 'is.', 'HEADIM', 'The', 'Pro', 'grainger', 'See attached pictures', 'lowe', 'property', 'N/A',
  ];
  const expStr = removeWordsArray.join('|');
  return txt.replace(new RegExp(`(${expStr})`, 'gi'), '').trim();
}
function forOrderNumbers(txt) {
  const removeWordsArray = [
    'Order', '#', 'Number', ':', ' ',
  ];
  const expStr = removeWordsArray.join('|');
  return txt.replace(new RegExp(`(${expStr})`, 'gi'), '').trim();
}
module.exports = { forPartNumbers, forOrderNumbers };
