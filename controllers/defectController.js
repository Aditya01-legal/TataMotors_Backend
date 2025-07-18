// defectController.js (Backend)
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const creds = require('../google-creds.json');
const spreadsheetId = '1L8wqNjI1FcoZB1k4dTNc0cYZjBPJeazXxFuadMmlTxY';

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const appendDefectRow = async (row) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Defects!A1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row]
    }
  });
};

exports.addDefect = async (req, res) => {
  try {
    const {
      issueArea,
      issueDescription,
      partDescription,
      partNumber,
      supplierName,
      vendorCode,
      ica,
      rootCause,
      pca,
      pdc,
      responsibility,
      issueReportedBy
    } = req.body;

    const timestamp = new Date().toISOString();

    const row = [
      '', // ID (auto via Google Sheets)
      timestamp, // Timestamp
      issueArea,
      issueDescription,
      partDescription,
      partNumber,
      supplierName,
      vendorCode,
      ica,
      rootCause,
      pca,
      pdc,
      responsibility,
      issueReportedBy
    ];

    await appendDefectRow(row);

    res.status(200).json({ message: 'Defect added and logged to Google Sheets.' });
  } catch (err) {
    console.error('Google Sheets Error:', err);
    res.status(500).json({ message: 'Failed to add defect to Google Sheets.' });
  }
};

