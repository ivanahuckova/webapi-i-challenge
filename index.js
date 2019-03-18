// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db.js');

const port = 8000;

server.use(express.json());
/*
GET REQUEST - When the client makes a GET request to /api/users:
If there's an error in retrieving the users from the database:
- cancel the request.
- respond with HTTP status code 500.
- return the following JSON object: { error: "The users information could not be retrieved." }.
*/

server.get('/api/users', (req, res) => {
  db.find()
    .then(data => {
      res.status(201);
      res.json(data);
    })
    .catch(() => {
      res.status(500);
      res.send({ error: 'The users information could not be retrieved.' });
    });
});

/*GET REQUEST - When the client makes a GET request to /api/users/:id:
If the user with the specified id is not found:
- return HTTP status code 404 (Not Found).
- return the following JSON object: { message: "The user with the specified ID does not exist." }.

If there's an error in retrieving the user from the database:
- cancel the request.
- respond with HTTP status code 500.
- return the following JSON object: { error: "The user information could not be retrieved." }. */

server.get('/api/users/:id', (req, res) => {
  db.findById(req.body.id)
    .then(() => {})
    .catch(() => {
      res.status(500);
      res.send({ error: 'The user information could not be retrieved.' });
    });
});

/*
POST REQUEST
If the request body is missing the name or bio property:
- cancel the request.
- respond with HTTP status code 400 (Bad Request).
- return the following JSON response: { errorMessage: "Please provide name and bio for the user." }. 

If the information about the user is valid:
- save the new user the the database.
- return HTTP status code 201 (Created).
- return the newly created user document.

If there's an error while saving the user:
- cancel the request.
- respond with HTTP status code 500 (Server Error).
- return the following JSON object: { error: "There was an error while saving the user to the database" }.
*/

server.post('/api/users', (req, res) => {
  if (req.body.name && req.body.bio) {
    db.insert(req.body)
      .then(() => {
        res.status(201);
        db.findById(res.body.id).then(user => res.json(user));
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

/*
DELETE REQUEST - When the client makes a DELETE request to /api/users/:id:
If the user with the specified id is not found:
- return HTTP status code 404 (Not Found).
- return the following JSON object: { message: "The user with the specified ID does not exist." }.

If there's an error in removing the user from the database:
- cancel the request.
- respond with HTTP status code 500.
- return the following JSON object: { error: "The user could not be removed" }. */

server.delete('/api/users/:id', (req, res) => {
  db.remove(req.body.id)
    .then(() => {})
    .catch(() => {
      res.status(500);
      res.send({ error: 'The user could not be removed' });
    });
});

server.listen(port, () => console.log(`Listening on port 8000`));
