import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi, { type ObjectSchema } from 'joi';
import { z, ZodError, ZodObject } from 'zod';
import type { RequireAtLeastOne } from '../types/types';

type RequestValidationSchema = RequireAtLeastOne<
  Record<'body' | 'query' | 'params', ObjectSchema>
>;

/**
 * This functions handles the validation of the given request validation schema
 *
 * @param {RequestValidationSchema} schema - The schema object can contain optional body, query, and params keys, each with a Joi schema object
 *
 * @returns Returns an HTTP response 400 BAD REQUEST if a validation error occurs or calls next if no error occurs
 *
 */
const validate =
  (schema: RequestValidationSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = Joi.object(schema).validate(
      {
        body: req.body,
        query: req.query,
        params: req.params
      },
      { abortEarly: false, stripUnknown: true }
    );

    if (!error) {
      next();
    }

    const errors = error?.details.map((err) => ({
      field: err.path.join(', '),
      message: err.message
    }));

    res.status(httpStatus.BAD_REQUEST).json({ errors });
  };

export default validate;

export const zodValidate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    // const {} = z.object(schema).parse()
    // const { error } = Joi.object(schema).validate(
    //   {
    //     body: req.body,
    //     query: req.query,
    //     params: req.params
    //   },
    //   { abortEarly: false, stripUnknown: true }
    // );

    try {
      schema.parse(req);
      next();
    } catch (err) {
      // console.log(err);
      if (err instanceof ZodError) {
        const errors = err.issues.map((iss) => ({
          field: iss.path,
          message: iss.message,
          code: iss.code
        }));

        res.status(httpStatus.BAD_REQUEST).json({ errors });
      }
    }

    // const errors = error?.details.map((err) => ({
    //   field: err.path.join(', '),
    //   message: err.message
    // }));

    // res.status(httpStatus.BAD_REQUEST).json({ errors });
  };
