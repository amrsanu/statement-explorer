const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');

const DIR_PATH = path.join('C:', 'statement-explorer');

const statementCache = new NodeCache();

exports.getIndex = (req, res, next) => {
  res.render('statement/index', {
    pageTitle: 'Home',
    path: '/',
  });
};

exports.getStatement = (req, res, next) => {
  let statement_table = statementCache.get('statementData'); // Retrieve statement data from cache

  if (!statement_table) {
    statement_table = 'Use the filter to get personalized information from Statement';
  }

  res.render('statement/statement', {
    min_date: '2020-01-01',
    max_date: '2023-12-31',
    credit_or_debit_option: 'All',
    expense_type_option: 'All',
    credit_or_debit: ['All', 'Credit', 'Debit'],
    expense_type: ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others'],
    statement_table: statement_table
  });
};


exports.postStatement = (req, res, next) => {
  console.log(req.body);
  res.render('statement/statement', { 
    min_date: '2020-01-01', 
    max_date: '2023-12-31', 
    credit_or_debit_option: 'All', 
    expense_type_option: 'All',
    credit_or_debit: ['All', 'Credit', 'Debit'], 
    expense_type: ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others'], 
    statement_table: "Statement will be Updated here [WIP]"
  });
};

exports.getUpdateStatement = (req, res, next) => {
  let statement_files = [];
  res.render('statement/update-statement', {
    pageTitle: 'Update Statement',
    path: '/update-statement',
    bank_option: "Select Bank",
    banks: ["HDFC", "ICICI"],
    upload_error: null,
    statement_files: statement_files
  });
};


exports.postNewStatement = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e., "statement") is used to retrieve the uploaded file
  let statement = req.files.statement;

  // Save the file to the cache
  try {
    statementCache.set('statementData', statement.data); // Store the file data in the cache with a specific key
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error: Unable to save file to cache.');
  }

  return res.redirect('/bank-statement');
};
exports.postModifyStatement = (req, res, next) => {
  return res.redirect('/update-statement');
};

exports.getHelp = (req, res, next) => {
  res.render('statement/help', {
    pageTitle: 'Help',
    path: '/help',
  });
};