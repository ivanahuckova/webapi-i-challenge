// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db.js');

const port = 8000;

server.use(express.json());

server.get('/', (req, res) => {
  res.send('Hello World');
});

server.post('/api/users', (req, res) => {
  db.update({ name: req.body.name, bio: req.body.bio }).then(data => {
    res.json(data);
  });
});

server.listen(port, () => console.log(`Listening on port 8000`));
