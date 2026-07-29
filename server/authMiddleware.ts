import type { Response, NextFunction } from 'express';
import jwt, { type VerifyErrors } from 'jsonwebtoken';
import type { AuthenticatedRequest } from './models/AuthenticatedRequest';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
      if (err) return res.sendStatus(403);
      req.user = { userId: (decoded as jwt.JwtPayload).userId as string };
      next();
    },
  );
};
