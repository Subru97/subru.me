const express = require('express');
const hbs = require("hbs");
const path = require('path');
const bodyParser = require('body-parser');

const mainRoute = require('./routes/main-routes');

const PORT = process.env.PORT || 5000;

var app = express();

app.use('*/public', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());                        

app.use('/', mainRoute);

app.use(function (req, res, next) {
  res.status(404).redirect('/');
});
  
hbs.registerHelper("equal", require("handlebars-helper-equal"));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));