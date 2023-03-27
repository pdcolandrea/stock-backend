import { Router } from 'express';
import validate, { zodValidate } from '../../middleware/validate';
import {
  sendVerifyEmailSchema,
  verifyEmailSchema
} from '../../validations/verifyEmail.validation';
import * as emailController from '../../controller/verifyEmail.controller';
import * as tradeController from '../../controller/trade.controller';
import {
  getAllTradesSchema,
  makeTradeSchema
} from '../../validations/trade.validation';

const tradeRouter = Router();

tradeRouter.get(
  '/trades',
  validate(getAllTradesSchema),
  tradeController.handleAllTrades
);

tradeRouter.post(
  '/trade',
  zodValidate(makeTradeSchema),
  tradeController.makeTrade
);

tradeRouter.post(
  '/send-verification-email',
  validate(sendVerifyEmailSchema),
  emailController.sendVerificationEmail
);

tradeRouter.post(
  '/verify-email/:token',
  validate(verifyEmailSchema),
  emailController.handleVerifyEmail
);

export default tradeRouter;
