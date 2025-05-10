import ReviewController from "@controllers/reviewController";
import { auth } from "@middlewares/auth";
import express from "express";

const reviewRouter = express.Router();

reviewRouter.post("/", auth, ReviewController.createReview);
reviewRouter.get("/id/:id", auth, ReviewController.getReviewById);
reviewRouter.get("/:productId", auth, ReviewController.getProductReviews);
reviewRouter.put("/:id", auth, ReviewController.updateReview);
reviewRouter.delete("/:id", auth, ReviewController.deleteReview);
reviewRouter.get("/", auth, ReviewController.getUserReviews);

export default reviewRouter;
