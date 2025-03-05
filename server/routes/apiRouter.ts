import express from "express";
import userRouter from "./userRoutes";
import vendorRouter from "./vendorRoutes";
import adminRouter from "./adminRoutes";
import authRouter from "./authRoutes";
import productRouter from "./productRoutes";
import cartRouter from "./cartRoutes";
import orderRouter from "./orderRoutes";

const apiRouter = express.Router(); // Parent router

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/vendor", vendorRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/product", productRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/order", orderRouter);

export default apiRouter;
