const express = require('express');
const router = require('./routes');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use('/', router);

app.listen(PORT, () => {
  console.log("Test", PORT);
});