// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db.js');

const port = 8000;

server.use(express.json());

server.post('/api/users', (req, res) => {
  if (req.body.name && req.body.bio) {
    db.insert(req.body)
      .then(() => {
        res.status(201);
        db.findById(id).then(newUser => res.json(newUser));
      })
      .catch(() => {
        res.status(500);
        res.send({ error: 'There was an error while saving the user to the database' });
      });
  } else {
    res.status(400);
    res.send({ errorMessage: 'Please provide name and bio for the user.' });
  }
});

server.listen(port, () => console.log(`Listening on port 8000`));
