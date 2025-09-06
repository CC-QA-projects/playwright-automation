const XLSX = require('xlsx');

/**
 * Reads usernames and passwords from an Excel file.
 * @param {string} filePath - Path to the Excel file.
 * @param {string} sheetName - Name of the sheet to read.
 * @returns {Array<{username: string, password: string}>}
 */
function readCredentials(filePath, sheetName = 'Sheet1') {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet);

  // Assumes columns are named 'username' and 'password'
  return rows.map(row => ({
    username: row.username,
    password: row.password
  }));
}

module.exports = { readCredentials };