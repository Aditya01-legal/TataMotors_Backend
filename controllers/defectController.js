const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '../data/defects.xlsx');

// Ensure file and sheet exist
async function initializeWorkbook() {
  const workbook = new ExcelJS.Workbook();

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  } else {
    const sheet = workbook.addWorksheet('Defects');
    sheet.addRow([
      'ID',
      'Vehicle System',
      'Other Vehicle System',
      'Severity',
      'Status',
      'Vehicle Model',
      'Other Vehicle Model',
      'Assigned To',
      'Reported By',
      'Reported On',
      'Resolution Date',
      'Defect Description',
      'Image (Base64)'
    ]);
    await workbook.xlsx.writeFile(filePath);
    return workbook;
  }

  const sheet = workbook.getWorksheet('Defects');
  const firstRow = sheet.getRow(1);
  const header = firstRow.values.slice(1); // Drop Excel internal index

  // ✅ Check if header is missing or incomplete
  if (!header.includes('Image (Base64)')) {
    sheet.insertRow(
      1,
      [
        'ID',
        'Vehicle System',
        'Other Vehicle System',
        'Severity',
        'Status',
        'Vehicle Model',
        'Other Vehicle Model',
        'Assigned To',
        'Reported By',
        'Reported On',
        'Resolution Date',
        'Defect Description',
        'Image (Base64)'
      ]
    );
    await workbook.xlsx.writeFile(filePath);
  }

  return workbook;
}


// Add a defect
exports.addDefect = async (req, res) => {
  try {
    const workbook = await initializeWorkbook();
    const sheet = workbook.getWorksheet('Defects');

    const {
      vehicleSystem,
      vehicleSystemOther,
      severity,
      status,
      vehicleModel,
      vehicleModelOther,
      assignedTo,
      reportedBy,
      reportedOn,
      resolutionDate,
      description,
      image
    } = req.body;

    const id = sheet.rowCount; // ID = row count (header is row 1)
    sheet.addRow([
      id,
      vehicleSystem,
      vehicleSystem === 'Others' ? vehicleSystemOther : '',
      severity,
      status,
      vehicleModel,
      vehicleModel === 'Other' ? vehicleModelOther : '',
      assignedTo,
      reportedBy,
      reportedOn,
      resolutionDate,
      description,
      image
    ]);

    await workbook.xlsx.writeFile(filePath);
    res.status(201).json({ message: 'Defect logged successfully!' });
  } catch (error) {
    console.error('Add Defect Error:', error);
    res.status(500).json({ error: 'Failed to log defect' });
  }
};

// Get all defects
exports.getDefects = async (req, res) => {
  try {
    const workbook = await initializeWorkbook();
    const sheet = workbook.getWorksheet('Defects');

    const rows = [];
    sheet.eachRow((row, index) => {
      if (index === 1) return; // skip header
      const [
        id,
        vehicleSystem,
        vehicleSystemOther,
        severity,
        status,
        vehicleModel,
        vehicleModelOther,
        assignedTo,
        reportedBy,
        reportedOn,
        resolutionDate,
        description,
        image
      ] = row.values.slice(1); // slice off Excel row index

      rows.push({
        id,
        vehicleSystem,
        vehicleSystemOther,
        severity,
        status,
        vehicleModel,
        vehicleModelOther,
        assignedTo,
        reportedBy,
        reportedOn,
        resolutionDate,
        description,
        image
      });
    });

    res.json(rows);
  } catch (error) {
    console.error('Get Defects Error:', error);
    res.status(500).json({ error: 'Failed to read defects' });
  }
};
