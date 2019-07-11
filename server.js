const {
  yellow, cyan, magenta,
} = require('ansi-colors');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const port = 3000;
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/', httpOnly: true, secure: false, maxAge: null,
  },
}));
app.use((req, res, next) => {
  console.log(yellow(`Cookies: ${JSON.stringify(req.cookies, null, 2)}`));
  next();
});

app.get('/', (req, res) => {
  const { id, counter = 1 } = req.session;
  req.session.counter = counter + 1;
  console.log(magenta(`User ${id} visit count: ${counter}`));
  res.cookie('testCookie', 'testValue');
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(cyan(`Example app listening on http://localhost:${port}!`));
});
