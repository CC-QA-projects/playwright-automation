import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_CREDENTIALS_PATH = path.join(__dirname, '../testData/LoginTest.xlsx');

/**
 * Reads usernames and passwords from an Excel file.
 * @param {string} filePath - Path to the Excel file.
 * @param {string} sheetName - Name of the sheet to read.
 * @returns {Array<{username: string, password: string}>}
 */
function readCredentials(filePath = null, sheetName = 'Sheet1') {
  const resolvedPath = filePath ?? DEFAULT_CREDENTIALS_PATH;
  const workbook = XLSX.readFile(resolvedPath);
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet);

  // Assumes columns are named 'username' and 'password'
  return rows.map(row => ({
    username: row.username,
    password: row.password
  }));
}

export { readCredentials };