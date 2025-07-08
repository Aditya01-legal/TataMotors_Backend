const express = require('express');
const router = express.Router();
const { addDefect, getDefects } = require('../controllers/defectController');

// ✅ Correctly named paths
router.post('/add', addDefect);
router.get('/', getDefects);

module.exports = router;

