const { appendDefectRow } = require("../services/googleSheetsService");

// Add a defect
exports.addDefect = async (req, res) => {
  try {
    const {
      date,
      issueReportedArea,
      issueDescription,
      partDescription,
      partNumber,
      supplierName,
      actionInitiated,
      rootCause,
      pca,
      status,
      responsibility,
      issueAttendedBy,
    } = req.body;

    const row = [
      new Date().toISOString(), // Auto ID (timestamp)
      date,
      issueReportedArea,
      issueDescription,
      partDescription,
      partNumber,
      supplierName,
      actionInitiated,
      rootCause,
      pca,
      status,
      responsibility,
      issueAttendedBy,
    ];

    console.log("Appending to Google Sheet:", row);

    await appendDefectRow(row);

    res.status(200).json({ message: "Defect added successfully" });
  } catch (error) {
    console.error("Google Sheets Error:", error);
    res.status(500).json({ error: "Failed to add defect" });
  }
};

