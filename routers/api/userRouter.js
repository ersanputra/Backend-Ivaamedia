const express = require("express");
const userRouter = express.Router();
const UserController = require('../../controllers/userController');
const userController = new UserController();

userRouter.post('/register', userController.createUser);
userRouter.post('/login', userController.login);
userRouter.post('/', userController.createUser);
userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);
userRouter.get('/orders', (req, res) => {
    res.send('Hello World');
  });
module.exports = userRouter;