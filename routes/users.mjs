import express from 'express';
import isLoggedin from '../utils/is-loggedin.mjs';
import { isSuperAdmin } from '../utils/isSuperAdmin.mjs'
import { isAdmin } from '../utils/isAdmin.mjs'
import { genValidator } from '../utils/gen-validator.mjs'
import { userLoginSchema, userRegisterSchema } from '../schema/schema.mjs'
import {
  login,
  register,
  addAdmin,
  getUsers,
  update,
  userMe,
  deleteUser,

} from '../controllers/users.mjs';

const userLoginValid = genValidator(userLoginSchema, '/users/login ')
const userRegisterValid = genValidator(userRegisterSchema, '/users/register ')
const router = express.Router();

router.post('/users/login', userLoginValid, login);
router.post('/users/register', userRegisterValid, register);
router.post('/users', isLoggedin, isSuperAdmin, addAdmin)
router.get('/users', isLoggedin, isAdmin, getUsers)
router.patch('/users/me', isLoggedin, update)
router.get('/users/me', isLoggedin, userMe)
router.delete('/users/:id', isLoggedin, deleteUser)

export default router;
