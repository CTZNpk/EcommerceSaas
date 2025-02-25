import express from "express";
import userRouter from "./userRoutes";
import vendorRouter from "./vendorRoutes";
import adminRouter from "./adminRoutes";

const apiRouter = express.Router(); // Parent router

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", userRouter);
apiRouter.use("/vendor", vendorRouter);
apiRouter.use("/admin", adminRouter);

export default apiRouter;
