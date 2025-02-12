import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET || "secret" ,
};

export default config;
