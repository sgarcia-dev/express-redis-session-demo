const {
  yellow, cyan, magenta, red,
} = require('ansi-colors');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');

const redisClient = redis.createClient();
const RedisStore = connectRedis(session);

const port = 3000;
const app = express();

redisClient.on('error', (err) => {
  console.log(red(`Redis error: ${err}`));
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(yellow(`Cookies: ${JSON.stringify(req.cookies, null, 2)}`));
  next();
});
app.use(session({
  secret: 'ThisIsHowYouUseRedisSessionStorage',
  name: '_redisPractice',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
  store: new RedisStore({
    host: 'localhost', port: 6379, client: redisClient, ttl: 86400,
  }),
}));

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
