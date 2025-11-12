import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

// Simple auth for demo:
// - Prefer header X-User-Id
// - Else parse Bearer JWT and read 'sub' or 'userId'
export const authOptional = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const hdr = req.header("X-User-Id");
  if (hdr) {
    req.userId = hdr;
    return next();
  }
  const auth = req.header("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length);
    try {
      const decoded = jwt.decode(token) as any;
      req.userId = decoded?.sub || decoded?.userId;
    } catch {}
  }
  return next();
};

export const authRequired = (req: AuthRequest, res: Response, next: NextFunction) => {
  authOptional(req, res, () => {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: missing userId" });
    }
    next();
  });
};
