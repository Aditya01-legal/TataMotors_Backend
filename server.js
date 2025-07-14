const express = require("express");
const cors = require("cors");
const app = express();

// Increase payload size limit (up to 10MB or more)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(cors());

const defectRoutes = require('./routes/defectRoutes');
app.use('/api/defects', defectRoutes); // ✅ THIS SHOULD BE RELATIVE

app.listen(3001, () => console.log('Server running on port 3001'));


