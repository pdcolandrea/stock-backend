import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { auth } from '../middleware/isAuth';
import prismaClient from '../config/prisma';

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
