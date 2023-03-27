import Joi from 'joi';
import z from 'zod';
import type { EmailRequestBody } from '../types/types';

export const sendVerifyEmailSchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const getAllTradesSchema = {
  body: Joi.object().keys({})
};

export const makeTradeSchema = z.object({
  body: z.object({
    ticker: z.string().min(1),
    fromCurrency: z.string().min(3)
  })
});
