const { google } = require('googleapis');
const path = require('path');
let credentials;

if (process.env.GOOGLE_CREDENTIALS) {
  credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} else {
  credentials = require('../google-creds.json'); // for local dev only
}


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

const SHEET_ID = '1L8wqNjI1FcoZB1k4dTNc0cYZjBPJeazXxFuadMmlTxY';
const SHEET_NAME = 'Defects';



async function appendDefectRow(rowData) {

    console.log("Appending to Google Sheet:", rowData);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [rowData],
    },
  });
}

module.exports = { appendDefectRow };
