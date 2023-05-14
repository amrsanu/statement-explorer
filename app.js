// Core package
const path = require('path');

// Third party packages
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Use defined packages
const statementRoutes = require('./routes/statement');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(statementRoutes);

// Page Not Found handler
app.use('/', (req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
  });
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500).render('404', { message: err.message });
  });

app.listen(3000, () => {
  console.log('listening on port 3000');
});