npm install googleapis google-auth-library
const fs = require('fs');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const ExcelJS = require('exceljs');

const CREDENTIALS_PATH = './credentials.json'; // from Google Cloud
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Get from Sheets URL
const SHEET_NAME = 'Defects Data'; // Tab name in your sheet

async function main() {
  const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, './data/defects.xlsx'));
  const sheet = workbook.getWorksheet('Defects');

  const values = [];
  sheet.eachRow((row) => {
    values.push(row.values.slice(1)); // Skip internal Excel ID
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  });

  console.log('✅ Data uploaded to Google Sheets!');
}

main().catch(console.error);
node uploadToSheets.js
