import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { auth } from '../middleware/isAuth';
import prismaClient from '../config/prisma';
import { makeTradeSchema } from '../validations/trade.validation';
import AlphaVantage from '../services/alpha-vantage';
import { Order, Trade } from '@prisma/client';
import logger from '../middleware/logger';

// export const handleVerifyEmail = async (req: Request, res: Response) => {
//   const { token } = req.params;

//   if (!token) return res.sendStatus(httpStatus.NOT_FOUND);

//   // Check if the token exists in the database and is not expired
//   const verificationToken = await prisma?.emailVerificationToken.findUnique({
//     where: { token }
//   });

//   if (!verificationToken || verificationToken.expiresAt < new Date()) {
//     return res
//       .status(httpStatus.NOT_FOUND)
//       .json({ error: 'Invalid or expired token' });
//   }

//   // Update the user's email verification status in the database
//   await prismaClient.user.update({
//     where: { id: verificationToken.userId },
//     data: { emailVerified: new Date() }
//   });

//   // Delete the verification tokens that the user owns form the database
//   await prismaClient.emailVerificationToken.deleteMany({
//     where: { userId: verificationToken.userId }
//   });

//   // Return a success message
//   res.status(200).json({ message: 'Email verification successful' });
// };

export const handleAllTrades = async (req: Request, res: Response) => {
  const user = auth(req);
  res.status(200).json(user);
};

export const makeTrade = async (req: Request, res: Response) => {
  const { body } = makeTradeSchema.parse(req);
  const user = await auth(req);

  // TODO: ALSO PARSE TICKER? DO SEARCH BEFORE IMPORT

  const pricing = await AlphaVantage.getForexRate(body.ticker);
  let price: number;
  try {
    price = parseFloat(
      pricing['Realtime Currency Exchange Rate']['5. Exchange Rate']
    );
  } catch (err) {
    logger.warn(err);
    return res.status(httpStatus.BAD_REQUEST).json({
      message: `Unable to find pricing data for ticker: ${body.ticker}`
    });
  }

  let orderID = parseInt(body.orderID ?? '');
  let tradeID = parseInt(body.tradeID ?? '');

  // create new order and continue
  let order: Order | null;
  if (!orderID) {
    order = await prismaClient.order.create({
      data: {
        ticker: body.ticker,
        user_id: user.id,
        profit: 0,
        original_amnt: body.amount,
        balance: body.amount
      }
    });
    orderID = order.id;
  } else {
    order = await prismaClient.order.findUnique({
      where: {
        id: orderID
      }
    });
  }

  if (!order || order.balance > body.amount) {
    return res
      .status(httpStatus.NOT_ACCEPTABLE)
      .json({ message: 'not enough funds' });
  }

  let shouldCloseOrder = false;
  let newBalance = order.balance;

  if (order.balance === body.amount) {
    shouldCloseOrder = true;
  }

  let trade: Trade | null;
  if (!tradeID) {
    // new trade (OPENING)
    trade = await prismaClient.trade.create({
      data: {
        entry: price,
        amount: body.amount,
        order_id: order.id
      }
    });
    tradeID = trade.id;
    newBalance -= body.amount;
  } else {
    // old trade (CLOSING) and update order
    trade = await prismaClient.trade.update({
      where: {
        id: tradeID
      },
      data: {
        status: 'closed',
        exit: price,
        amount: body.amount
      }
    });
  }

  const trades = await prismaClient.trade.findMany({
    where: {
      AND: [
        {
          order_id: orderID
        },
        {
          status: 'closed'
        }
      ]
    }
  });

  // calculate profit
  let profit = 0;
  trades.forEach((trade) => {
    const fEntry = trade.amount * trade.entry;
    const fExit = trade.amount * (trade.exit ?? 0);
    const fProfit = fExit - fEntry;
    profit += fProfit;
  });

  // finally -- update order profit
  if (body.orderID) {
    await prismaClient.order.update({
      where: {
        id: orderID
      },
      data: {
        status: shouldCloseOrder ? 'closed' : 'active',
        balance: newBalance,
        profit
      }
    });
  }

  res.status(200).send({ status: 'success' });
};
