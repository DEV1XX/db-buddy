import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  APP_DB_URI: process.env.APP_DB_URI,
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
