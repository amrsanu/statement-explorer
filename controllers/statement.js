const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const csv = require('fast-csv');

let statement_files = [];
const statementCache = new NodeCache();

exports.getIndex = (req, res, next) => {
  res.render('statement/index', {
    pageTitle: 'Home',
    path: '/',
  });
};

exports.getStatement = (req, res, next) => {
  let statement_table = [];

  if (statement_files.length === 0) {
    statement_table = 'Use the filter to get personalized information from Statement';
  } else {
    statement_files.forEach((file) => {
      let fileData = statementCache.get(file);

      if (fileData) {
        console.log('Reading File:', file);

        // Parse the CSV file data into a 2D array
        const parsedData = [];
        fileData.forEach((row) => {
          const rowData = [];
          Object.values(row).forEach((value) => {
            rowData.push(value);
          });
          parsedData.push(rowData);
        });

        // Append the parsed data to the statement table
        statement_table = statement_table.concat(parsedData);
      }
    });
  }

  // Use the statement_table array for further processing or filtering logic
  console.log(statement_table);

  // Render the statement page with the table data
  res.render('statement/statement', {
    min_date: '2020-01-01',
    max_date: '2023-12-31',
    credit_or_debit_option: 'All',
    expense_type_option: 'All',
    credit_or_debit: ['All', 'Credit', 'Debit'],
    expense_type: ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others'],
    statement_table: statement_table,
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
    statement_files.push(statement.name);

    // Filter out empty lines from the CSV data
    const filteredData = statement.data
      .toString()
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .join('\n');

    // Parse the filtered CSV data and convert it to a table format
    const rows = [];
    csv.parseString(filteredData, { headers: true })
      .on('error', (error) => {
        console.error(error);
        return res.status(500).send('Server Error: Unable to parse the CSV file.');
      })
      .on('data', (row) => rows.push(row))
      .on('end', () => {
        // Store the table data in the cache with a specific key
        statementCache.set(statement.name, rows);

        return res.redirect('/bank-statement');
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error: Unable to save file to cache.');
  }
};



exports.postModifyStatement = (req, res, next) => {
  // Assuming statement_files is an array of file names
  let statement_files_to_delete = req.body.statement_file; // Assuming statement_files is an array of file names
  console.log(statement_files_to_delete);

  if (!Array.isArray(statement_files_to_delete)) {
    statement_files_to_delete = [statement_files_to_delete];
  }
  // Remove files from cache based on the provided file names
  statement_files_to_delete.forEach((file) => {
    // Remove the file from the cache using the file name as the key
    statementCache.del(file); 
    const index = statement_files.indexOf(file);
    if (index !== -1) {
      statement_files.splice(index, 1);
    }
  });

  return res.redirect('/update-statement');
};


exports.getHelp = (req, res, next) => {
  res.render('statement/help', {
    pageTitle: 'Help',
    path: '/help',
  });
};