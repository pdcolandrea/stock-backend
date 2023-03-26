import { Router } from 'express';
import validate from '../../middleware/validate';
import {
  forgotPasswordSchema,
  resetPasswordSchema
} from '../../validations/password.validation';
import * as passwordController from '../../controller/forgotPassword.controller';
import logger from '../../middleware/logger';
import AlphaVantage from '../../services/alpha-vantage';

const passwordRouter = Router();

passwordRouter.get('/t', async (req, res) => {
  logger.info(req);
  const resp = await AlphaVantage.getForexRate('GME');
  res.status(200).send({ resp });
});

passwordRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  passwordController.handleForgotPassword
);
passwordRouter.post(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  passwordController.handleResetPassword
);

export default passwordRouter;
