import { CustomRequest } from "@middlewares/auth";
import { Response } from "express";
import Rating, { IRating } from "@models/rating";
import Order, { OrderStatus } from "@models/order";

class ReviewController {
  static async createReview(req: CustomRequest, res: Response) {
    try {
      const { productId, rating, review } = req.body;
      const userId = req.userId;

      // Validate input
      if (!productId) {
        res.status(400).json({ message: "Product ID is required" });
        return;
      }
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        res.status(400).json({
          message: "Rating must be a number between 1 and 5",
        });
        return;
      }

      // Check if user has already reviewed this product
      const existingRating = await Rating.findOne({ userId, productId });
      if (existingRating) {
        res.status(400).json({
          message: "You have already reviewed this product",
        });
        return;
      }

      // Verify if the user has completed an order with this product
      const completedOrder = await Order.findOne({
        buyer: userId,
        products: {
          $elemMatch: {
            product: productId,
          },
        },
        orderStatus: OrderStatus.DELIVERED,
      });

      if (!completedOrder) {
        res.status(403).json({
          message:
            "You can only review products you have purchased and received",
        });
        return;
      }

      // Create and save the new rating
      const newRating = new Rating({
        userId,
        productId,
        rating,
        review: review || undefined,
      });
      await newRating.save();

      res.status(201).json(newRating);
    } catch (error) {
      console.error("Review creation error:", error);
      res.status(500).json({ message: "Server error", error: error });
    }
  }
  // Get all reviews for a specific product
  static async getProductReviews(req: CustomRequest, res: Response) {
    try {
      const { productId } = req.params;
      const reviews = await Rating.find({ productId }).sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get a single review by its ID
  static async getReviewById(req: CustomRequest, res: Response) {
    try {
      const { id } = req.params;
      const review = await Rating.findById(id);

      if (!review) {
        res.status(404).json({ message: "Review not found" });
        return;
      }

      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update an existing review
  static async updateReview(req: CustomRequest, res: Response) {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;
      const userId = req.userId;

      const existingReview = await Rating.findById(id);
      if (!existingReview) {
        res.status(404).json({ message: "Review not found" });
        return;
      }

      // Authorization check
      if (existingReview.userId.toString() !== userId) {
        res.status(403).json({ message: "Unauthorized to update this review" });
        return;
      }

      // Validate and update rating
      if (rating !== undefined) {
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
          res
            .status(400)
            .json({ message: "Rating must be a number between 1 and 5" });
          return;
        }
        existingReview.rating = rating;
      }

      // Update review text if provided
      if (review !== undefined) {
        existingReview.review = review;
      }

      await existingReview.save();
      res.status(200).json(existingReview);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Delete a review
  static async deleteReview(req: CustomRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const review = await Rating.findById(id);
      if (!review) {
        res.status(404).json({ message: "Review not found" });
        return;
      }

      // Authorization check
      if (review.userId.toString() !== userId) {
        res.status(403).json({ message: "Unauthorized to delete this review" });
        return;
      }

      await Rating.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get user's reviews
  static async getUserReviews(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;

      const reviews = await Rating.find({
        userId,
      });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
}

export default ReviewController;
