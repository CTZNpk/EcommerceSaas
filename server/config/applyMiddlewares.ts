import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./env";

const applyMiddlewares = (app: express.Application) => {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(
    cors({
      origin: ENV.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(cookieParser());

  app.listen(ENV.PORT, () => {
    console.log(`Server is running on http://localhost:${ENV.PORT}`);
  });
};

export default applyMiddlewares;
