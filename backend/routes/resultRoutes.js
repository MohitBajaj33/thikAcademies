const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllResults, getUserResults,exportResultsToExcel } = require('../controllers/resultController');

router.get('/admin', protect, adminOnly, getAllResults);  
router.get('/my', protect, getUserResults); 
router.get('/admin/export', protect, adminOnly, exportResultsToExcel);
              

module.exports = router;
