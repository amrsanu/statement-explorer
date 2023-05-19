const {
    parseDate,
    formatDateRev,
    getExpenseType,
    getCurrentDate
  } = require('../parser_companion');

function getStatementParserICICI(
    start_date,
    end_date,
    file, 
    isStatementUpdated, 
    isTrimmed, 
    statement_table, 
    statementCache) {

    start_date = getCurrentDate();
    end_date = getCurrentDate();
    min_date = getCurrentDate();
    max_date = getCurrentDate();
    isStatementUpdated =  true;
    isTrimmed = false;
    statement_table = "WIP";
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
    getStatementParserICICI
};