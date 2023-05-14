exports.getIndex = (req, res, next) => {
  res.render('statement/index', {
    pageTitle: 'Home',
    path: '/',
  });
};

exports.getStatement = (req, res, next) => {
  res.render('statement/statement', {
    min_date: '2020-01-01', 
    max_date: '2023-12-31', 
    credit_or_debit_option: 'All', 
    expense_type_option: 'All',
    credit_or_debit: ['All', 'Credit', 'Debit'], 
    expense_type: ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others'], 
    statement_table: ''
  });
};

exports.postStatement = (req, res, next) => {
  res.render('statement/statement', { 
    min_date: '2020-01-01', 
    max_date: '2023-12-31', 
    credit_or_debit_option: 'All', 
      expense_type_option: 'All',
    credit_or_debit: ['All', 'Credit', 'Debit'], 
    expense_type: ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Others'], 
    statement_table: "statement_table"
  });
};

// exports.getUpdateStatement = (req, res, next) => {
//   res.render('statement/update-statement', {
//     pageTitle: 'Update Statement',
//     path: '/update-statement',
//   });
// };

exports.getHelp = (req, res, next) => {
  res.render('statement/help', {
    pageTitle: 'Help',
    path: '/help',
  });
};