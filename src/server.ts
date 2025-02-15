import express, { Request, Response } from "express";
import config from "./config/config";
import routes from "./routes/index";

const PORT = config.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running..." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
