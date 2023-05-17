const fs = require('fs');

const DIR_PATH = 'C:/statement-explorer';
exports.getIndex = (req, res, next) => {
  res.render('statement/index', {
    pageTitle: 'Home',
    path: '/',
  });
};

exports.getStatement = (req, res, next) => {
  let statement_table = 'Use the filter to get personalized information from Statement';
  statement_table = "No Statement Found in Directory";
  if (!fs.existsSync(DIR_PATH)) {
    res.render('statement/statement', {
      min_date: '2020-01-01',
      max_date: '2023-12-31',
      credit_or_debit_option: 'All',
      expense_type_option: 'All',
      credit_or_debit: ['All', 'Credit', 'Debit'],
      expense_type: ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others'],
      statement_table: statement_table
    });
  }
  fs.readdir(DIR_PATH, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      // Create an array to hold the content of all files
      const fileContents = [];

      files.forEach(file => {
        const filePath = `${DIR_PATH}/${file}`;

        // Read the file content
        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error(err);
            // If there is an error reading a file, set its content to an empty string
            fileContents.push('');
          } else {
            fileContents.push(data.toString());
          }

          // Check if all files have been read
          if (fileContents.length === files.length) {
            // All files have been read, so set the final statement table and render the page
            statement_table = fileContents.join('\n');
            res.render('statement/statement', {
              min_date: '2020-01-01',
              max_date: '2023-12-31',
              credit_or_debit_option: 'All',
              expense_type_option: 'All',
              credit_or_debit: ['All', 'Credit', 'Debit'],
              expense_type: ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others'],
              statement_table: statement_table
            });
          }
        });
      });
    }
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
  fs.readdir(DIR_PATH, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      // Create an array to hold the content of all files
      files.forEach(file => {
        statement_files.push(file);
      })
    }
    console.log(statement_files);
    res.render('statement/update-statement', {
      pageTitle: 'Update Statement',
      path: '/update-statement',
      bank_option: "Select Bank",
      banks: ["HDFC", "ICICI"],
      upload_error: null,
      statement_files: statement_files
    });
  });

};

exports.postNewStatement = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "statement") is used to retrieve the uploaded file
  let statement = req.files.statement;
  console.log(statement);
  console.log(req.body);

  // Use the mv() method to place the file somewhere on your server
  if (!fs.existsSync(DIR_PATH)) {
    // Create the directory if it does not exist
    console.log('Creating directory: ' + DIR_PATH);
    fs.mkdirSync(DIR_PATH);
  }
  statement.mv(`${DIR_PATH}/${statement.name}` , function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Server Error: Unable to save file.");
    }
    return res.redirect('/bank-statement');
  });
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