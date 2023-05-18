const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const csv = require('fast-csv');

let statement_files = [];
const statementCache = new NodeCache();
let is_statement_updated = false;

const IMAGES = [
  { url: "/images/image1.png", name: "image1" },
  { url: "/images/images2.png", name: "images2" },
  { url: "/images/images3.png", name: "images3" },
  { url: "/images/images4.png", name: "images4" },
  { url: "/images/images5.png", name: "images5" },

]

function parseDate(dateString) {
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are zero-based
  const year = 2000 + parseInt(parts[2], 10); // Assuming 20xx format

  return new Date(year, month, day);
}

exports.getIndex = (req, res, next) => {
  if (statement_files.length === 0) {
    const images = [];
    statement_table = ' Use the filter to get personalized information from Statement';

    return res.render('statement/no-statement', {
      bank_option: "Select Bank",
      banks: ["HDFC", "ICICI"],
      images: IMAGES,
      upload_error: null,
      pageTitle: 'Home',
      path: '/',

    });
  }
  return res.render('statement/index', {
    pageTitle: 'Home',
    path: '/'
  });
};

exports.getStatement = (req, res, next) => {
  let statement_table = [];
  let start_date = req.body.start_date;
  let end_date = req.body.end_date;
  const credit_or_debit = "All";
  const expense_type_option = "All";

  if (!start_date){
    start_date = '01/01/2015';
  }
  if (!end_date) {
    end_date = '01/01/2015';
  }
  console.log("Get Statement: ", start_date, end_date, credit_or_debit, expense_type_option);

  if (statement_files.length === 0) {
    console.log('No statement files');
    return res.render('statement/no-statement', {
      bank_option: "Select Bank",
      banks: ["HDFC", "ICICI"],
      images: IMAGES,
      upload_error: null,
      pageTitle: 'Home',
      path: '/',

    });
  } else if (is_statement_updated === false) {

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
          console.log(rowData[0]);
          parsedData.push(rowData);
        });
        statement_table = statement_table.concat(parsedData);
      }
    });
    statement_table.sort((a, b) => {
      const dateA = new Date(parseDate(a[0]));
      const dateB = new Date(parseDate(b[0]));
      return dateA - dateB;
    });
    is_statement_updated = true;

    const filteredTable = statement_table.filter((row) => {
      const currentDate = parseDate(row[0]);
      return currentDate >= parseDate(start_date) && currentDate <= parseDate(end_date);
      statementCache.set("statement_table", statement_table);
    });
  } else {
    console.log('Usning previous statement');
    statement_table = statementCache.get("statement_table");
  }
  if (statement_table.length){
    statement_table = statement_table.map(row => {
      return row.filter((_, index) => index !== 2);
    });
    
    console.log(statement_table[0], statement_table[statement_table.length - 1]);
  }
  // Render the statement page with the table data
  res.render('statement/statement', {
    min_date: start_date,
    max_date: end_date,
    credit_or_debit_option: credit_or_debit,
    expense_type_option: expense_type_option,
    credit_or_debit: ['All', 'Credit', 'Debit'],
    expense_type: ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others'],
    statement_table: statement_table
  });
};


exports.postStatement = (req, res, next) => {
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const credit_or_debit = req.body.credit_or_debit;
  const expense_type_option = req.body.category;

  console.log("Filter Statement: ", start_date, end_date, credit_or_debit, expense_type_option);

  if (is_statement_updated === false) {
    statement_table = statementCache.get("statement_table");

    statement_table.sort((a, b) => {
      const dateA = new Date(parseDate(a[0]));
      const dateB = new Date(parseDate(b[0]));
      return dateA - dateB;
    });
    is_statement_updated = true;

    const filteredTable = statement_table.filter((row) => {
      const currentDate = parseDate(row[0]);
      return currentDate >= parseDate(start_date) && currentDate <= parseDate(end_date);
      statementCache.set("statement_table", statement_table);
    });
  } else {
    console.log('Usning previous statement');
    statement_table = statementCache.get("statement_table");
  }
  res.render('statement/statement', { 
    min_date: start_date,
    max_date: end_date,
    credit_or_debit_option: credit_or_debit,
    expense_type_option: expense_type_option,
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
    is_statement_updated = false;

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
  is_statement_updated = false;

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