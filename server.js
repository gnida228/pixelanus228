const restify = require('restify');
const socketIo = require('socket.io');
const ip = require('ip');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const express = require('express');
const server = restify.createServer();
const app = express();
const { TextEncoder, TextDecoder } = require("util");
const cookie = require('cookie');
const {MongoClient} = require('mongodb');
const CookieParser = require('restify-cookies');
const client = new MongoClient('mongodb+srv://zyb:123456qwerty@cluster0.krwuh.mongodb.net/kingog?retryWrites=true&w=majority');
const io = socketIo.listen(server.server);

server.get('/*', restify.plugins.serveStatic({
  directory: './client',
  default: 'index.html'
}));

const urlencodedParser = express.urlencoded({extended: false});
server.use(CookieParser.parse);

server.get('/authors', function(req, res, next){
  fs.readFile(path.join(__dirname, './client/components', '/authors.html'), function (err, data) {
    if (err) {
        next(err);
        return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(data);
    next();
  });
});
server.get('/news', function(req, res, next){
  fs.readFile(path.join(__dirname, './client/components', '/news.html'), function (err, data) {
    if (err) {
        next(err);
        return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(data);
    next();
  });
});

server.get('/signin', function indexHTML(req, res, next) {
  var cookies = cookie.parse(req.headers.cookie || '');
  const start = async () => {
    await client.connect();
    const users = client.db().collection('users');
    const z = await users.findOne({hash:{$eq: cookies.sex}});    
    if(z){
        res.redirect('/', next);
    }else{
      fs.readFile(path.join(__dirname, './client/components', '/signin.html'), function (err, data) {
        if (err) {
            next(err);
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
    });
    }}
    start();
});

function randomNum(min, max) {
  return md5(Math.floor(Math.random() * (max - min) ) + min);
}

server.post('/authDet',urlencodedParser, function (req, res, next){
  //Получение данных от пользователя и переделываем в стринг
  const login = req.body.login.toString();
  const password = req.body.password.toString();
  const start = async () => {
    await client.connect();
    const users = client.db().collection('users');
    const search_login_in_db = await users.findOne({login:{$eq: login}});
    const search_password_in_db = await users.findOne({password:{$eq: password}});
    if(search_login_in_db && search_password_in_db){
        const hash = randomNum(1000, 10000)
        await users.update(
          {
           login: login
          },

          {
            $set: {
              hash: hash
              }
          }
           );
        res.setCookie('sex', hash);
        res.redirect('/', next);
    }else{
        res.redirect('/signin', next);
    }}
    start();
});

server.get('/eula', function(req, res, next){
  fs.readFile(path.join(__dirname, './client/components', '/eula.html'), function (err, data) {
    if (err) {
        next(err);
        return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(data);
    next();
  });
});

server.get('/exit', function(req, res, next) {

  var cookies = req.cookies.sex;
  
  const start = async () => {
    
    await client.connect();
    
    const users = client.db().collection('users');
    
    const z = await users.findOne({hash:{$eq: cookies}});
    
    if(z){
        const hash = randomNum(1000, 10000)
        await users.update(
          {
           hash: cookies
          },

          {
            $set: {
              hash: ""
              }
          }
           );
           //Очищение кукки и ридерект на главную страницу
        res.clearCookie('sex');
        res.redirect('/', next);
    }else{
      res.redirect('/', next);
    }}

    //Запуск функции
    start();
  
})

let line_history = [];
let colors = ['#2B2E31','#61676a','#a7adb1','#dde2e4','#fafafa','#951a21','#e91d2d','#e9968c','#e35b22','#f5831f','#fbc59a',
'#ffdd1a','#f8e6b7','#126936','#46b749','#c8e4bd','#1c505a','#75cedb','#0076a9','#009fd7','#192e62','#3b55a3','#aebeed',
'#492e72','#7e3f98','#d3bfe5','#901c53','#d70b8c','#efb1d4','#603913','#a97b50','#e2c095','#070709'];

let count = 0;
ipConnected = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {
  var cookies = socket.handshake.headers['sex'];
  count++;
  io.emit('online', { count: count });
  console.log({ count: count });
  socket.on('disconnect', function(){
        count--
        io.emit('online', { count: count });
        console.log({ count: count });
    });
  const start = async () => {
    await client.connect();
    const users = client.db().collection('users');
    const z = await users.findOne({hash:{$eq: cookies}});    
    if(z){
      
     // first send the history to the new client
  line_history.forEach(line => {
    socket.emit('draw_line', line);
  });

  // add handler for message type "draw_line".
  socket.on('draw_line', function (data) {
    if(data.width != 1 || data.height != 1)
    {
      console.log("error #1")
    }
    else
    {
      colors.forEach(colorsHash => {
        if (colorsHash == data.color) {

          line_history.push(data);

          io.emit('draw_line', data);
        }
        else
        {
    
        }
      });

    }
  });
         
    }else{
      
    }}
    start();

});

server.listen(3000, () => {
  console.log('%s listening at %s', server.name, server.url);
});
