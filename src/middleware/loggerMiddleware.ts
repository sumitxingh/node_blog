import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`
    Incoming Request:
    Method: ${req.method}
    URL: ${req.originalUrl}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    Params: ${JSON.stringify(req.params)}
    Headers: ${JSON.stringify(req.headers)}
    IP: ${req.ip}
    User-Agent: ${req.get("User-Agent")}
  `);
    
    

  next();
};

export default logRequest;
