function getCurrentDate() {
    return new Date();
}
  
function parseDate(dateString) {
    let separator;
    if (dateString.includes('/')) {
        separator = '/';
        const parts = dateString.split(separator);
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = 2000 + parseInt(parts[2], 10);
        return new Date(year, month, day);

    } else if (dateString.includes('-')) {
        separator = '-';
        const parts = dateString.split(separator);
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[0], 10);
        return new Date(year, month, day);

    } else {
        throw new Error('Invalid date format');
    }  
}
  
function formatDateRev(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(4, '0');
    return `${year}-${month}-${day}`;
}
  
function getExpenseType(transactionDetails){
    let expense_type = ["All"];
    transactionDetails.forEach(info => {
        let trimmedDetail = info.split(" ")[0];
        const hyphenCount = trimmedDetail.split('-').length - 1;
        if (hyphenCount > 2) {
        const parts = trimmedDetail.split('-');
        const trimmedParts = parts.slice(0, 3);
        trimmedDetail = trimmedParts.join('-');
        if (trimmedDetail.length > 30){
            const trimmedParts = parts.slice(0, 2);
            trimmedDetail = trimmedParts.join('-');
        }
        }
        if (!info.includes("UPI")){
        const parts = info.split(' ');
        const trimmedParts = parts.slice(0, 3);
        trimmedDetail = trimmedParts.join(' ');
        if (trimmedDetail.length > 30){
            const trimmedParts = parts.slice(0, 2);
            trimmedDetail = trimmedParts.join(' ');
        }
        }
        expense_type.push(trimmedDetail);
    });
    return expense_type;
}

module.exports = {
    getCurrentDate,
    parseDate,
    formatDateRev,
    getExpenseType
};