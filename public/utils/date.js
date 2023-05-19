function getCurrentDate() {
    return new Date();
}

function formatDate(dateString) {
    if (!dateString){
        dateString = getCurrentDate();
    }
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
}
  

function formatDateRev(date) {
    if (!date){
        date = getCurrentDate();
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(4, '0');
    console.log(`Date: ${day}/${month}/${year}`);
    return `${year}-${month}-${day}`;
  }