import express, { Request, Response } from "express";
import config from "./config/config";
import routes from "./routes/index";
import logRequest from "./middleware/loggerMiddleware";
import cors from "cors";
import cookieParser from "cookie-parser";


const PORT = config.PORT;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization", "Set-Cookie"], 
    exposedHeaders: ["Authorization", "Set-Cookie"], 
    maxAge: 3600, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);


app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running..." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
