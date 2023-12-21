// express
const express = require('express');
const router = express.Router();
// database
const userModel = require('../models/user');

// routes
router.get('/all', getAllUsers);
router.get('/:username', getUser);
router.post('/', createUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

// handlers
async function getAllUsers(request, response) {
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
  const username = request.body.username;

  try {

    const usernameQuery = await userModel.find({ username: username });

    if (usernameQuery.length) {
      response.status(400).send('Username unavailable');
    } else {
      const newUser = await userModel.create(userToCreate);

      response.status(201).json(newUser);
    }

  } catch (error) {
    console.error(error.message);
  }
}

async function updateUser(request, response) {
  const userId = request.params.userId;
  const userWithUpdates = request.body;

  try {

    await userModel.findByIdAndUpdate(userId, userWithUpdates);
    const updatedUser = await userModel.findById(userId);

    response.status(200).json(updatedUser);

  } catch (error) {
    console.error(error.message);
  }
}

async function deleteUser(request, response) {
  const userId = request.params.userId;

  try {

    await userModel.findByIdAndDelete(userId);

    response.status(204).send('User Deleted');

  } catch (error) {
    console.error(error.message);
  }
}

module.exports = router;
