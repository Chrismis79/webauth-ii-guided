const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const KnexSessionStore
= require('connect-session-knex')(sessions);
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knex = require('../database/dbConfig');

const server = express();

const sessionConfiguration = {
  //session storage options
  name: 'chocolatechip', //default would be sid, by giving it a different name it blocks hacks from knowing what library we are using.
  secret: 'keep it secret, keep it safe',
//secrets used for encryption(must be an environemt variable)
  saveUninitialized: true, //has implications with complying with laws that requite permission to save cookies
  resave: false, 

  //how to store sessions
  store: new KnexSessionStore({ //new KW is a must!
    knex, //imported from dbConfig.js
    tablename: 'sessions',
    createtable: true, //if not there, create a table
    sidfieldname: 'sid',
    clearInterval: 1000 * 60 * 10,  //defaults to 6000
  }),

  //cookie options
  cookie: {
    maxAge: 1000 * 60 * 10, //10mins in milliseconds
    secure: false, //if false the cookie is sent over http, if true only sent over https. Always true in production
    httpOnly: true, //if true JS cannot access the cookie
  }
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfiguration))  //adds a req.session object

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
