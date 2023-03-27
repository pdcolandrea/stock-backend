import Joi from 'joi';
import z from 'zod';
import type { EmailRequestBody } from '../types/types';

export const sendVerifyEmailSchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const getAllTradesSchema = z.object({
  params: z
    .object({
      status: z.string().min(3).optional(),
      skip: z.string().optional()
    })
    .optional()
});

export const makeTradeSchema = z.object({
  body: z.object({
    ticker: z.string().min(3),
    amount: z.number().min(1),
    orderID: z.string().optional(),
    tradeID: z.string().optional(),
    crypto: z.boolean().optional()
  })
});

export const getTradeSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
