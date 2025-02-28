import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET || "jwt-secret",
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET || "refresh-secret",
};

export default config;
