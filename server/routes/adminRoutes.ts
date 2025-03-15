import AdminController from "@controllers/adminController";
import { auth, isAdmin } from "@middlewares/auth";
import express, { Response, Request } from "express";

const adminRouter = express.Router();

adminRouter.get("/", auth, isAdmin, (_: Request, res: Response) => {
  res.status(200).json({ data: "Certified User" });
});

adminRouter.post("/update-user", auth, isAdmin, AdminController.updateUser);
adminRouter.post("/delete-user", auth, isAdmin, AdminController.deleteUser);
adminRouter.post("/block-user", auth, isAdmin, AdminController.blockUser);
adminRouter.get("/get-users", auth, isAdmin, AdminController.getUsers);

export default adminRouter;
