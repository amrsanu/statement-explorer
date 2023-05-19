const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const csv = require('fast-csv');
const { pseudoRandomBytes } = require('crypto');

const {
  parseDate,
  formatDateRev,
  getExpenseType
} = require('./bank_parser/parser_companion');

const { getStatementParserHDFC } = require('./bank_parser/hdfc/hdfc_parser');
const { getStatementParserICICI } = require('./bank_parser/icici/icici_parser');
let statement_files = [];
const statementCache = new NodeCache();
let isStatementUpdated = false;
let isTrimmed = true;

const IMAGES = [
  { url: "/images/image1.png", name: "image1" },
  { url: "/images/images2.png", name: "images2" },
  { url: "/images/images3.png", name: "images3" },
  { url: "/images/images4.png", name: "images4" },
  { url: "/images/images5.png", name: "images5" }
]

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

  // console.log("Statement: ", start_date, end_date, credit_or_debit, expense_type_option);

  if (statement_files.length === 0) {
    // console.log('No statement files');
    return res.render('statement/no-statement', {
        bank_option: "Select Bank",
        banks: ["HDFC", "ICICI"],
        images: IMAGES,
        upload_error: null,
        pageTitle: 'Home',
        path: '/',
    });
  }
  let min_date = start_date;
  let max_date = end_date;

  statement_table = [];
  console.log(statement_files);
  statement_files.forEach((statement) => {
    bank = statement.bank;
    file = statement.file;
    if (bank == "HDFC") {
      [ start_date, end_date, min_date, max_date, isStatementUpdated, isTrimmed, statement_table ] = 
        getStatementParserHDFC( start_date, end_date, file, isStatementUpdated, isTrimmed, statement_table, statementCache );
    }
    if (bank == "ICICI") {
      [ start_date, end_date, min_date, max_date, isStatementUpdated, isTrimmed, statement_table ] = 
        getStatementParserICICI( start_date, end_date, file, isStatementUpdated, isTrimmed, statement_table, statementCache );
    }
  });
      // let fileData = statementCache.get(bank, file);
  if (Array.isArray(statement_table) && statement_table.every(Array.isArray)){
    expense_type = getExpenseType(statement_table.map(row => row[1]));
  } else{
    expense_type = ["All"]
  }

  console.log("Statement: ", start_date, end_date, min_date, max_date, statement_files, isStatementUpdated, isTrimmed);
  // Render the statement page with the table data
  res.render('statement/statement', {
    start_date: formatDateRev(start_date),
    end_date: formatDateRev(end_date), 
    min_date: formatDateRev(min_date),
    max_date: formatDateRev(max_date),
    credit_or_debit_option: credit_or_debit,
    expense_type_option: expense_type_option,
    credit_or_debit: ['All', 'Credit', 'Debit'],
    expense_type: expense_type,
    statement_table: statement_table
  });
};


exports.postStatement = (req, res, next) => {
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const credit_or_debit = req.body.credit_or_debit;
  const expense_type_option = req.body.category;
  
  statement_table = statementCache.get("statement_table");
  min_date = parseDate(statement_table[0][0]);
  max_date = parseDate(statement_table[statement_table.length - 1][0]);
  
  console.log("Post Statement: ", start_date, end_date, credit_or_debit, expense_type_option);
  // console.log("Filter Statement: ", parseDate(start_date), parseDate(end_date), parseDate(statement_table[0][0]));
  // console.log(statement_table[0]);
  let filteredTable = [];
  if (statement_files.length !== 0){
    statement_table = statementCache.get("statement_table");
    let indxToRemove = -1;
    if (credit_or_debit === "Credit"){
      indxToRemove = 2;
    }
    if (credit_or_debit === "Debit"){
      indxToRemove = 3;
    }
    filteredTable = statement_table.map(row => {
      return row.filter((_, index) => index !== indxToRemove);
    });
  
    filteredTable = filteredTable.filter((row) => {
      const currentDate = parseDate(row[0]);
      return currentDate >= parseDate(start_date) && currentDate <= parseDate(end_date);
    });
    // console.log(credit_or_debit, filteredTable);
    if (credit_or_debit !== "All") {
      filteredTable = filteredTable.filter((row) => {
        return row[2].trim() !== "0.00";
      });
    }
    if (expense_type_option !== "All") {
      filteredTable = filteredTable.filter((row) => {
        return row[1].includes(expense_type_option);
      });   
    }
    
    filteredTable.sort((a, b) => {
      const dateA = parseDate(a[0]);
      const dateB = parseDate(b[0]);
      return dateA - dateB;
    });
  }
  // console.log("Filtered Statement: ", filteredTable)
  res.render('statement/statement', { 
    start_date: start_date,
    end_date: end_date, 
    min_date: formatDateRev(min_date),
    max_date: formatDateRev(max_date),
    credit_or_debit_option: credit_or_debit,
    expense_type_option: expense_type_option,
    credit_or_debit: ['All', 'Credit', 'Debit'], 
    expense_type: getExpenseType(statement_table.map(row => row[1])),
    statement_table: filteredTable
  });
};

exports.getUpdateStatement = (req, res, next) => {
  let files = []
  statement_files.forEach((statement) => {
    files.push(`${statement.bank}: ${statement.file}`);
  })
  res.render('statement/update-statement', {
    pageTitle: 'Update Statement',
    path: '/update-statement',
    bank_option: "Select Bank",
    banks: ["HDFC", "ICICI"],
    upload_error: null,
    statement_files: files
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
    statement_files.push({bank: req.body.bank, file: statement.name});
    isStatementUpdated = false;

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
  // console.log(statement_files_to_delete);
  isStatementUpdated = false;
  console.log(statement_files_to_delete);

  if (!Array.isArray(statement_files_to_delete)) {
    statement_files_to_delete = [statement_files_to_delete];
  }
  // Remove files from cache based on the provided file names
  console.log(statement_files);

  statement_files_to_delete.forEach((file) => {
    // Remove the file from the cache using the file name as the key
    console.log(file);
    statementCache.del(file); 
    const index = statement_files.findIndex(obj => obj.bank === file.split(": ")[0] && obj.file === file.split(": ")[1]);
    if (index !== -1) {
      statement_files.splice(index, 1);
    }
    
  });
  console.log(statement_files);

  return res.redirect('/update-statement');
};


exports.getHelp = (req, res, next) => {
  res.render('statement/help', {
    pageTitle: 'Help',
    path: '/help',
  });
};
