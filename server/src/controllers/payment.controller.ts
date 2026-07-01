import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "../services/payment.service.js";

// ─── Validation Schemas ─────────────────────────────────────────────────────────

const createOrderSchema = z.object({
  paymentId: z.string().uuid(),
});

const verifyPaymentSchema = z.object({
  paymentId: z.string().uuid(),
  sessionId: z.string().optional(),
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
    const result = await svc.handleWebhook(req.body);
    res.status(200).json(result);
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
