// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db.js');

const port = 8000;

server.use(express.json());

//====== GET REQUESTS ===== //

server.get('/api/users', (req, res) => {
  db.find()
    .then(user => {
      res.json(user);
    })
    .catch(() => {
      res.status(500).json({ error: 'The users information could not be retrieved.' });
    });
});

server.get('/api/users/:id', (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'The user with the specified ID does not exist.' });
      } else {
        res.json(user);
      }
    })
    .catch(() => {
      res.status(500).json({ error: 'The user information could not be retrieved.' });
    });
});

//====== POST REQUESTS ===== //

server.post('/api/users', (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    db.insert(req.body)
      .then(user => {
        db.findById(user.id).then(user => {
          res.status(201).json(user);
        });
      })
      .catch(() => {
        res.status(500).json({ error: 'There was an error while saving the user to the database' });
      });
  }
});

//====== DELETE REQUESTS ===== //

server.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id)
    .then(user => {
      if (user === 0) {
        res.status(404);
        res.send({ message: 'The user with the specified ID does not exist.' });
      } else {
        res.json({ message: `User with id ${req.params.id} was deleted` });
      }
    })
    .catch(() => {
      res.status(500);
      res.send({ error: 'The user could not be removed' });
    });
});

//====== PUT REQUESTS ===== //

server.put('/api/users/:id', (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    db.update(req.params.id, req.body)
      .then(user => {
        if (user === 0) {
          res.status(404).json({ message: 'The user with the specified ID does not exist.' });
        } else {
          res.status(200).json({ message: `User with id ${req.params.id} was updated` });
        }
      })
      .catch(() => {
        res.status(500).json({ error: 'The user information could not be modified.' });
      });
  }
});

server.listen(port, () => console.log(`Listening on port 8000`));
