// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db.js');

const port = 8000;

server.use(express.json());

//====== GET REQUESTS (OK)===== //

server.get('/api/users', (req, res) => {
  db.find()
    .then(data => {
      res.status(200);
      res.json(data);
    })
    /* 
    GET REQUEST - When the client makes a GET request to /api/users:
    If there's an error in retrieving the users from the database:
      - cancel the request.
      - respond with HTTP status code 500.
      - return the following JSON object: { error: "The users information could not be retrieved." }.
    */
    .catch(() => {
      res.status(500);
      res.send({ error: 'The users information could not be retrieved.' });
    });
});

server.get('/api/users/:id', (req, res) => {
  console.log(req.params.id);
  db.findById(req.params.id)
    .then(user => {
      /* 
        GET REQUEST - When the client makes a GET request to /api/users/:id:
        If the user with the specified id is not found:
          - return HTTP status code 404 (Not Found).
          - return the following JSON object: { message: "The user with the specified ID does not exist." }.
      */
      if (!user) {
        res.status(404);
        res.send({ message: 'The user with the specified ID does not exist.' });
      } else {
        res.json(user);
      }
    })
    /*
      GET REQUEST - When the client makes a GET request to /api/users/:id:
      If there's an error in retrieving the user from the database:
        - cancel the request.
        - respond with HTTP status code 500.
        - return the following JSON object: { error: "The user information could not be retrieved." }. 
    */
    .catch(() => {
      res.status(500);
      res.send({ error: 'The user information could not be retrieved.' });
    });
});

//====== POST REQUESTS ===== //

server.post('/api/users', (req, res) => {
  /*
  POST REQUEST - If the request body is missing the name or bio property:
    - cancel the request.
    - respond with HTTP status code 400 (Bad Request).
    - return the following JSON response: { errorMessage: "Please provide name and bio for the user." }. 
  */
  if (!req.body.name || !req.body.bio) {
    res.status(400);
    res.send({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    /*
      POST REQUEST - If the information about the user is valid:
        - save the new user the the database.
        - return HTTP status code 201 (Created).
        - return the newly created user document.
    */
    db.insert(req.body)
      .then(() => {
        res.status(201);
        db.findById(id).then(user => res.json(user));
      })

      /*
        POST REQUEST - If there's an error while saving the user:
          - cancel the request.
          - respond with HTTP status code 500 (Server Error).
          - return the following JSON object: { error: "There was an error while saving the user to the database" }.
      */
      .catch(() => {
        res.status(500);
        res.send({ error: 'There was an error while saving the user to the database' });
      });
  }
});

server.delete('/api/users/:id', (req, res) => {
  /*
    DELETE REQUEST - When the client makes a DELETE request to /api/users/:id:
    If the user with the specified id is not found:
      - return HTTP status code 404 (Not Found).
      - return the following JSON object: { message: "The user with the specified ID does not exist." }.
*/
  db.remove(req.body.id)
    .then(user => {
      if (!user) {
        res.status(404);
        res.send({ message: 'The user with the specified ID does not exist.' });
      }
    })

    /*
      DELETE REQUEST - If there's an error in removing the user from the database:
        - cancel the request.
        - respond with HTTP status code 500.
        - return the following JSON object: { error: "The user could not be removed" }. 
    */
    .catch(() => {
      res.status(500);
      res.send({ error: 'The user could not be removed' });
    });
});

server.put('/api/users/:id', (req, res) => {
  /*
  PUT REQUEST - When the client makes a PUT request to /api/users/:id:
  If the request body is missing the name or bio property:
    - cancel the request.
    - respond with HTTP status code 400 (Bad Request).
    - return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.
  */
  if (!req.body.name || !req.body.bio) {
    res.status(400);
    res.send({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    /*
    PUT REQUEST - When the client makes a PUT request to /api/users/:id:
    If the user with the specified id is not found:
      - return HTTP status code 404 (Not Found).
      - return the following JSON object: { message: "The user with the specified ID does not exist." }.
*/
    db.update(id, req.body)
      .then(user => {
        if (!user) {
          res.status(404);
          res.send({ message: 'The user with the specified ID does not exist.' });
        } else {
          /*
        PUT REQUEST - When the client makes a PUT request to /api/users/:id:
        If the user is found and the new information is valid:
          - update the user document in the database using the new information sent in the reques body.
          - return HTTP status code 200 (OK).
          - return the newly updated user document.
        */
          res.status(200);
          res.json(user);
        }
      })
      .catch(() => {
        /*
      PUT REQUEST - When the client makes a PUT request to /api/users/:id:
      If there's an error when updating the user:
        - cancel the request.
        - respond with HTTP status code 500.
        - return the following JSON object: { error: "The user information could not be modified." }.
      */
        res.status(500);
        res.send({ error: 'The user information could not be modified.' });
      });
  }
});

server.listen(port, () => console.log(`Listening on port 8000`));
