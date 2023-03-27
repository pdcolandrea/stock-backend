import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import compressFilter from './utils/compressFilter.util';
import {
  authRouter,
  passwordRouter,
  tradeRouter,
  verifyEmailRouter
} from './routes/v1';
import isAuth, { auth } from './middleware/isAuth';
import { errorHandler } from './middleware/errorHandler';
import config from './config/config';
import authLimiter from './middleware/authLimiter';
import { xssMiddleware } from './middleware/xssMiddleware';
import AlphaVantage from './services/alpha-vantage';

const app: Express = express();

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// app.use(xssMiddleware);

app.use(cookieParser());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    // origin: [config.cors_origin],
    origin: '*',
    credentials: true
  })
);

if (config.node_env === 'production') {
  app.use('/v1/auth', authLimiter);
}

app.use('/api/v1/auth', authRouter);

app.use('/api/v1', passwordRouter);

app.use('/api/v1', verifyEmailRouter);

app.use('/api/v1', isAuth, tradeRouter);

app.use('/secret', isAuth, async (_req, res) => {
  console.warn(_req.payload);
  const user = await auth(_req);
  res.json({
    message: 'You can see me',
    user
  });
});

app.use(errorHandler);

export default app;
