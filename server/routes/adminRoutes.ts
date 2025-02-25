import { auth, isAdmin } from "@middlewares/auth";
import express, { Response, Request } from "express";

const adminRouter = express.Router();

adminRouter.get("/", auth, isAdmin, (_: Request, res: Response) => {
  res.status(200).json({ data: "Certified User" });
});

export default adminRouter;
