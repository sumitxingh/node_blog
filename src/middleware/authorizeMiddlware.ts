import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

const authorize = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const decode = jwt.verify(token, config.JWT_SECRET);
    if (!decode) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.body.user = decode;
    next();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default authorize;
