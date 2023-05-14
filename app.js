// Core package
const path = require('path');

// Third party packages
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Use defined packages
const errorController = require('./controllers/error');
const statementRoutes = require('./routes/statement');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.send(<h1>Working till here...</h1>)
});

// app.use(statementRoutes);

// Page Not Found handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.error("Something went wrong");
  res.status(500).send('Something broke!');
});

app.use(errorController.get404);

app.listen(3000, () => {
  console.log('listening on port 3000');
});