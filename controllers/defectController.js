// backend/controllers/defectController.js
const { appendDefectRow } = require('../services/googleSheetsService');

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
      issueReportedBy,
    } = req.body;

    const timestamp = new Date().toISOString();

    const row = [
      '',                // ID (auto by Google Sheets formula)
      timestamp,         // Timestamp
      issueArea,
      issueDescription,
      partDescription,
      partNumber,
      supplierName,
      vendorCode,
      ica,               // Now labeled as ICA
      rootCause,
      pca,
      pdc,               // PDC after PCA
      responsibility,    // Now a textarea
      issueReportedBy    // Changed from "Issue Attended By"
    ];

    await appendDefectRow(row);

    res.status(200).json({ message: 'Defect added and logged to Google Sheets.' });
  } catch (err) {
    console.error('Google Sheets Error:', err);
    res.status(500).json({ message: 'Failed to add defect to Google Sheets.' });
  }
};


