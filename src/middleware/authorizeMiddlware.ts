import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

const OptionalAuthorizeUrl = [
  { urlRegex: /^\/api\/comment\/[a-f0-9-]{36}$/, method: "GET" },
];

const authorize = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      const isOptionalAuthorizeUrl = OptionalAuthorizeUrl.some(
        (route) => route.urlRegex.test(req.originalUrl) && route.method === req.method
      );

      if (isOptionalAuthorizeUrl) {
        next();
        return;
      }

      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.body.user = decoded;

    next();
  } catch (error: any) {
    console.log("Error during authorization:", error);

    if (error.message === "jwt expired" || error.name === "JsonWebTokenError") {
      res.clearCookie("refresh_token");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.clearCookie("refresh_token");
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authorize;
