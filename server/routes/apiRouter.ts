import express from "express";
import userRouter from "./userRoutes";
import vendorRouter from "./vendorRoutes";
import adminRouter from "./adminRoutes";
import authRouter from "./authRoutes";

const apiRouter = express.Router(); // Parent router

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/vendor", vendorRouter);
apiRouter.use("/admin", adminRouter);

export default apiRouter;
