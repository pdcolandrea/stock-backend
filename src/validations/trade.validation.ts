import Joi from 'joi';
import type { EmailRequestBody } from '../types/types';

export const sendVerifyEmailSchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const getAllTradesSchema = {
  body: Joi.object().keys({})
};
