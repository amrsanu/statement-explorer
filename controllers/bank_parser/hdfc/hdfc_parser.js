const {
    parseDate,
    formatDateRev,
    getExpenseType
  } = require('../parser_companion');

function getStatementParserHDFC(
    start_date,
    end_date,
    file, 
    isStatementUpdated, 
    isTrimmed, 
    statement_table, 
    statementCache) {
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
        // console.log(rowData[0]);
        parsedData.push(rowData);
    });
    statement_table = statement_table.concat(parsedData);
    }

    statement_table.sort((a, b) => {
        const dateA = parseDate(a[0]);
        const dateB = parseDate(b[0]);
        return dateA - dateB;
    });
    isStatementUpdated = true;
    // console.log(statement_table[0], statement_table[statement_table.length - 1]);

    if (!start_date){
        start_date = parseDate(statement_table[0][0]);
    }
    if (!end_date) {
        end_date = parseDate(statement_table[statement_table.length - 1][0]);
    }
    // console.log("Min/Max Statement: ", start_date, end_date, credit_or_debit, expense_type_option);

    statementCache.set("statement_table", statement_table);
    
    if (isTrimmed){
    isTrimmed = false;
    statement_table = statementCache.get("statement_table");
    statement_table = statement_table.map(row => {
        return row.filter((_, index) => index !== 2);
    });
    }
    min_date = parseDate(statement_table[0][0]);
    max_date = parseDate(statement_table[statement_table.length - 1][0]);
    
    if (!start_date){
    start_date = min_date;
    }
    if (!end_date) {
    end_date = max_date;
    }
    statementCache.set("statement_table", statement_table);
        // console.log("Get Statement: ", formatDateRev(start_date), formatDateRev(end_date), credit_or_debit, expense_type_option);
        
    return [
        start_date,
        end_date,
        min_date,
        max_date,
        isStatementUpdated, 
        isTrimmed, 
        statement_table
    ];
}    

module.exports = {
    getStatementParserHDFC
};