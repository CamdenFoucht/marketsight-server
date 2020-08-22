require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/market');
const accountRoutes = require('./routes/account');

app.all('*', function (req, res, next) {
  var origin = req.get('origin');
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

var allowlist = [
  'http://localhost:3000',
  'http://www.cfoucht.com',
  'http://cfoucht.com',
  'http://www.cfoucht.com/mketsight',
];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection successfull'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('Greetings from MarketSight!'));
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/account', accountRoutes);

app.listen(process.env.PORT || 8000, function () {
  console.log('Listening on port ' + process.env.PORT || 8000);
});
