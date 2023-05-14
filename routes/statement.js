const path = require('path');
const express = require('express');

const shopController = require('../controllers/statement');

const router = express.Router();

router.get('/', shopController.getIndex);
module.exports = router;
