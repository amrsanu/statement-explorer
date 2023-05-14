const path = require('path');
const express = require('express');

const statementController = require('../controllers/statement');

const router = express.Router();

router.get('/', statementController.getIndex);
router.get('/help', statementController.getHelp);

module.exports = router;
