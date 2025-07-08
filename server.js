const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const defectRoutes = require('./routes/defectRoutes');
app.use('/api/defects', defectRoutes); // ✅ No colon or invalid symbol here

app.listen(3001, () => console.log('Server running on port 3001'));

