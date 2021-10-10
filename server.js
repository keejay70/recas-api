const express = require('express');

const app = express();
const cors = require('cors');
const api = require('./api');
// const pusher = require('./pusher');
const port = process.env.PORT || 3000;
// enabling CORS to accept from all origins
app.use(cors());
// express.json() and express.urlencoded() are built-in middleware functions to support JSON-encoded and URL-encoded bodies.
// to be able to get object data from the url
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enabling CORS to accept from all origins
app.all('*', (req, res, next) => {
  console.log(`${new Date()} - request for ${req.path}`);
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('welcome to the recas-api endpoint.');
});

app.post('/reportCrime', api.reportCrime);

app.post('/editCrime', api.editCrime);

app.get('/getAllCrimes', api.getAllCrimes);

app.post('/searchCrime', api.searchCrime);

app.get('/getAllCrimeTypes', api.getAllCrimeTypes);

app.post('/getCrimeType', api.getCrimeType);

app.post('/sendLatLong', api.sendLatLong);

app.post('/register', api.register);

app.post('/login', api.login);

app.post('/getUnitLocation', api.getUnitLocation);

app.listen(port, () => {
  console.log(`listening on port: `+port);
});