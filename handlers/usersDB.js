// express
const express = require('express');
const router = express.Router();
// database
const userModel = require('../models/user');

// routes
router.get('/all', getAllUsers);
router.get('/:username', getUser);
router.post('/', createUser);
// router.put('/:userId', updateUser);
// router.delete('/:userId', deleteUser);

// handlers
async function getAllUsers (request, response) {
  try {

    const users = await userModel.find();

    response.status(200).json(users);

  } catch (error) {
    console.error(error.message);
  }
}

async function getUser(request, response) {
  const username = request.params.username;

  try {

    const user = await userModel.find({ username: username });

    if (user.length) {
      response.status(200).json(user);
    } else {
      response.status(404).send('User Not Found');
    }

  } catch (error) {
    console.error(error.message);
  }
}

async function createUser(request, response) {
  const userToCreate = request.body;

  try {

    const newUser = await userModel.create(userToCreate);

    response.status(201).json(newUser);

  } catch (error) {
    console.error(error.message);
  }
}

module.exports = router;
