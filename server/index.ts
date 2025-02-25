import express from "express";
import apiRouter from "@routes/apiRouter";
import { applyMiddlewares, connectDB } from "config";

const app = express();

applyMiddlewares(app);
connectDB();

app.use("/api/v1/", apiRouter);
