import router from "express";
import {
  createPayment,
  createOrder,
  verifyPayment,
  webhook,
  getPayment,
} from "../controllers/payment.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { generalLimiter } from "../middlewares/rateLimiter.middleware.js";

const paymentRouter = router.Router();

// Webhook is public (called by Razorpay servers)
paymentRouter.post("/webhook", webhook);

// User-authenticated routes
paymentRouter.post("/create-order", authenticateUser, generalLimiter, createOrder);
paymentRouter.post("/verify", authenticateUser, generalLimiter, verifyPayment);
paymentRouter.post("/", authenticateUser, generalLimiter, createPayment); // Legacy
paymentRouter.get("/:paymentId", authenticateUser, generalLimiter, getPayment);

export default paymentRouter;
