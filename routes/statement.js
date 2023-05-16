const path = require('path');
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const statementController = require('../controllers/statement');

const router = express.Router();

router.get('/', statementController.getIndex);

router.get('/bank-statement', statementController.getStatement);
router.post('/bank-statement', statementController.postStatement);

router.get('/update-statement', statementController.getUpdateStatement);
router.post('/new-statement', statementController.postNewStatement);
router.post('/modify-statement', statementController.postModifyStatement);

router.get('/help', statementController.getHelp);

module.exports = router;
