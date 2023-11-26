import { Router } from 'express';
import {
  createUser,
  readUserByID,
  readUserByMail,
  updateUser,
  deleteUser,
} from './usuario.controller';

const usuarioRouter = Router();

usuarioRouter.post('/', createUser);
usuarioRouter.get('/:id', readUserByID);
usuarioRouter.get('/:mail/:password', readUserByMail);
usuarioRouter.patch('/:id', updateUser);
usuarioRouter.delete('/:id', deleteUser);

export default usuarioRouter;