import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "../services/payment.service.js";

// ─── Validation Schemas ─────────────────────────────────────────────────────────

const createOrderSchema = z.object({
  paymentId: z.string().uuid(),
});

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  paymentId: z.string().uuid(),
});

// Legacy schema for backward compatibility
const legacyWebhookSchema = z.object({
  transactionId: z.string().min(1),
  paymentId: z.string().uuid(),
  status: z.enum(["success", "failed"]),
});

// ─── Controller Handlers ────────────────────────────────────────────────────────

/**
 * POST /payments/create-order
 * Create a Razorpay order for payment checkout
 */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { paymentId } = createOrderSchema.parse(req.body);
    const orderData = await svc.createRazorpayOrder(paymentId);
    res.status(200).json({ success: true, data: orderData });
  } catch (e) {
    next(e);
  }
};

/**
 * POST /payments/verify
 * Verify Razorpay payment after checkout completion
 */
export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const payload = verifyPaymentSchema.parse(req.body);
    const result = await svc.verifyPayment(payload);
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * POST /payments/webhook
 * Handle Razorpay webhook events (server-to-server)
 */
export const webhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;

    // Check if this is a legacy mock webhook call (for backward compatibility)
    const legacyParsed = legacyWebhookSchema.safeParse(req.body);
    if (legacyParsed.success) {
      // Handle legacy mock webhook format
      const { transactionId, paymentId } = legacyParsed.data;
      const result = await svc.verifyPayment({
        razorpayOrderId: transactionId,
        razorpayPaymentId: `mock_${transactionId}`,
        razorpaySignature: "mock_signature",
        paymentId,
      });
      res.status(200).json({ success: true, data: result });
      return;
    }

    // Handle real Razorpay webhook
    const result = await svc.handleWebhook(req.body, signature || "");
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * POST /payments/create (deprecated)
 * Legacy endpoint - redirects to create-order
 */
export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { paymentId } = createOrderSchema.parse(req.body);
    const session = await svc.createRazorpayOrder(paymentId);
    res.status(200).json({ success: true, data: { session } });
  } catch (e) {
    next(e);
  }
};

/**
 * GET /payments/:paymentId
 * Get payment details
 */
export const getPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const payment = await svc.getPayment(req.params.paymentId, req.user?.id);
    res.status(200).json({ success: true, data: { payment } });
  } catch (e) {
    next(e);
  }
};
