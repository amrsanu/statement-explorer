// Core package
const path = require('path');

// Third party packages
const bodyParser = require('body-parser');
const express = require('express');
const serveStatic = require('serve-static');

const app = express();

// Use defined packages
const errorController = require('./controllers/error');
const statementRoutes = require('./routes/statement');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(serveStatic(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, 'public')));
app.use("/", statementRoutes);

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