const express = require('express');
const router = express.Router();

let userTest;

// routes
// router.get('/all', getAllUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
// router.put('/:userId', updateUser);
// router.delete('/:userId', deleteUser);

// handlers
async function getUser(request, response) {
  const userId = request.params.userId;

  if (userId === userTest.username) {
    response.status(200).json(userTest);
  } else {
    response.status(400).send('User Not Found');
  }

}

async function createUser(request, response) {
  const user = request.body;
  userTest = user;
  response.status(201).json(userTest);
}

module.exports = router;
