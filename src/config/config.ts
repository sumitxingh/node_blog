import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
};

console.log({ config });

export default config;
