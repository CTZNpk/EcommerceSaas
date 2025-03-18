import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./env";
import http from "http";
import SocketController from "@controllers/socketController";

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

  const server = http.createServer(app);
  new SocketController(server);
  server.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });;
};

export default applyMiddlewares;
