// change history

// hs005 add moderation service - send data also to port 4003
// hs006 add event data storage

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
// 003hs get rid of problem
//  has been blocked by CORS policy: Response to preflight request doesn't pass access control check
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
 
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// hs006 add code to store the events received
const events = [];


app.post('/events', (req, res) => {
    const event = req.body;

    // hs006 add code to store the events received
    events.push(event);

    axios.post('http://docker-compose_dhbw-exercise1-nodejs-posts_1:4000/events', event);
    axios.post('http://docker-compose_dhbw-exercise1-nodejs-comments_1:4001/events', event);
    axios.post('http://docker-compose_dhbw-exercise1-nodejs-query_1:4002/events', event);
    // 005hs send data also to moderation service
    axios.post('http://docker-compose_dhbw-exercise1-nodejs-moderation_1:4003/events', event);

    res.send({status: 'ok event rec. and forwarded'});
});

// hs006 add code to store the events received and return the events list when a get request is received
app.get('/events', (req, res) => {
  console.log(events);
  res.send(events);
});

app.listen(4005, () => {
    console.log('Listening to 4005');
});