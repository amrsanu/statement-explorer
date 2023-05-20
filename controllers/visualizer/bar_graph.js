const { createCanvas, registerFont } = require('canvas');
const Chart = require('chart.js/auto');

const credit = {
    title: 'Credit Distribution',
    color: 'yellow',
}

const debit = {
    title: 'Debit Distribution',
    color: 'green',
}

function getPieChart(type, distribution) {
  // Create a new canvas
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  let pieConfig = {};
  if (type === 'Credits') {
    pieConfig = credit;
  }
  if (type === 'Debit') {
    pieConfig = debit;
  }
  // Generate the combined data
  const labels = Object.keys(distribution);
  const values = Object.values(distribution);

  // Create the chart
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [pieConfig.color], // Customize the colors as needed
      }],
    },
  });

  // Convert the canvas to a buffer
  const buffer = canvas.toBuffer('image/png');
  return buffer;
}

function generateBarGraph(creditData, debitData) {
    // Create a new canvas
    const canvas = createCanvas(1000, 400);
    const ctx = canvas.getContext('2d');
  
    // Generate the data
    const labels = Object.keys(creditData);
    const creditValues = Object.values(creditData);
    const debitValues = Object.values(debitData);
  
    // Calculate the maximum value for y-axis
    const maxDataValue = Math.max(...creditValues, ...debitValues);
    const yAxisMax = Math.ceil(maxDataValue / 10000) * 10000; // Round up to the nearest 10000

    // Create the chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Credit',
            data: creditValues,
            backgroundColor: '#53F253', // Customize the color as needed
          },
          {
            label: 'Debit',
            data: debitValues,
            backgroundColor: '#EB6632', // Customize the color as needed
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#D3D3D3', // Customize the grid color as needed
            },
            ticks: {
              precision: 0,
              max: yAxisMax, 
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });
  
    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer('image/png');
    return buffer;
  }
  

function generateBarChart(statement_table) {
  const monthlyCredit = {};
  const monthlyDebit = {};

  statement_table.forEach(row => {
    const date = row[0].trim(); // Assuming the date is in the first column
  
    // Extract the credit and debit amounts from the respective columns
    const debitAmount = parseFloat(row[2].trim());
    const creditAmount = parseFloat(row[3].trim());
  
    // Extract the month and year from the date
    const [day, month, year] = date.split('/').map(part => parseInt(part.trim(), 10));
  
    const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' });
    const key = `${monthName} ${year.toString().slice(-2)}`;

    if (debitAmount) {
      monthlyDebit[key] = (monthlyDebit[key] || 0) + debitAmount;
    }
    if (creditAmount) {
      monthlyCredit[key] = (monthlyCredit[key] || 0) + creditAmount;
    }
  });
  console.log('Monthly Credit:', monthlyCredit);
  console.log('Monthly Debit:', monthlyDebit);
  imageBuffer = generateBarGraph(monthlyCredit, monthlyDebit);

  return imageBuffer
}


module.exports = {
    generateBarChart
};