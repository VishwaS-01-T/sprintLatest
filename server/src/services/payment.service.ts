/**
 * Payment Service - Razorpay Integration
 *
 * Handles payment order creation and webhook verification
 * with real Razorpay SDK integration.
 */

import crypto from "crypto";
import razorpay, {
  verifyPaymentSignature,
  getRazorpayKeyId,
} from "../lib/razorpay.js";
import { paymentRepository } from "../repositories/payment.repository.js";
import { orderRepository } from "../repositories/order.repository.js";
import { AppError } from "../utils/AppError.js";

export class PaymentError extends AppError {}

const IS_PRODUCTION = process.env.NODE_ENV?.toUpperCase() === "PRODUCTION";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

// ─── Service Functions ──────────────────────────────────────────────────────────

/**
 * Create a Razorpay order for payment
 * POST /payments/create-order
 */
export const createRazorpayOrder = async (paymentId: string) => {
  const payment = await paymentRepository.findById(paymentId);
  if (!payment) throw new PaymentError(404, "Payment not found");
  if (payment.paymentStatus !== "PENDING") {
    throw new PaymentError(400, "Payment is not in pending state");
  }

  // If we already have a Razorpay order ID, return it
  if (payment.transactionId?.startsWith("order_")) {
    return {
      razorpayOrderId: payment.transactionId,
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: Math.round(payment.amount * 100), // Razorpay expects amount in paise
      currency: payment.currency,
      keyId: getRazorpayKeyId(),
    };
  }

  // Create new Razorpay order
  const razorpayOrder = (await razorpay.orders.create({
    amount: Math.round(payment.amount * 100), // Convert to paise
    currency: payment.currency || "INR",
    receipt: payment.id,
    notes: {
      paymentId: payment.id,
      orderId: payment.orderId,
    },
  })) as RazorpayOrderResponse;

  // Store Razorpay order ID in our payment record
  await paymentRepository.updateTransactionId(payment.id, razorpayOrder.id);

  return {
    razorpayOrderId: razorpayOrder.id,
    paymentId: payment.id,
    orderId: payment.orderId,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: getRazorpayKeyId(),
  };
};

/**
 * Verify Razorpay payment callback and update order status
 * POST /payments/verify
 */
export const verifyPayment = async (payload: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  paymentId: string;
}) => {
  const payment = await paymentRepository.findById(payload.paymentId);
  if (!payment) throw new PaymentError(404, "Payment not found");

  // Skip signature verification in development if using mock payments
  const skipVerification = !IS_PRODUCTION && payload.razorpaySignature === "mock_signature";

  if (!skipVerification) {
    // Verify signature
    const isValid = verifyPaymentSignature(
      payload.razorpayOrderId,
      payload.razorpayPaymentId,
      payload.razorpaySignature,
    );

    if (!isValid) {
      // Mark payment as failed
      await paymentRepository.updateStatus(payment.id, "FAILED", {
        transactionId: payload.razorpayPaymentId,
      });
      await orderRepository.updatePaymentStatus(payment.orderId, "FAILED");
      throw new PaymentError(400, "Invalid payment signature");
    }
  }

  // Payment verified successfully - update statuses
  await paymentRepository.updateStatus(payment.id, "COMPLETED", {
    transactionId: payload.razorpayPaymentId,
    paidAt: new Date(),
  });
  await orderRepository.updatePaymentStatus(payment.orderId, "COMPLETED");
  await orderRepository.updateStatus(payment.orderId, "CONFIRMED");

  return {
    success: true,
    paymentId: payment.id,
    orderId: payment.orderId,
    transactionId: payload.razorpayPaymentId,
  };
};

/**
 * Handle Razorpay webhook events
 * POST /payments/webhook
 *
 * This endpoint receives automated callbacks from Razorpay
 * for various payment events (payment.captured, payment.failed, etc.)
 */
export const handleWebhook = async (
  payload: Record<string, unknown>,
  signature: string,
) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Verify webhook signature if secret is configured
  if (webhookSecret) {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (signature !== expectedSignature) {
      throw new PaymentError(400, "Invalid webhook signature");
    }
  }

  const event = payload.event as string;
  const paymentEntity = (payload.payload as Record<string, unknown>)
    ?.payment as Record<string, unknown>;
  const payment = paymentEntity?.entity as Record<string, unknown>;

  if (!payment) {
    return { received: true, processed: false };
  }

  const razorpayOrderId = payment.order_id as string;
  const razorpayPaymentId = payment.id as string;

  // Find our payment record by Razorpay order ID
  const ourPayment =
    await paymentRepository.findByTransactionId(razorpayOrderId);
  if (!ourPayment) {
    console.warn(
      `[Webhook] Payment not found for Razorpay order: ${razorpayOrderId}`,
    );
    return { received: true, processed: false };
  }

  switch (event) {
    case "payment.captured":
      await paymentRepository.updateStatus(ourPayment.id, "COMPLETED", {
        transactionId: razorpayPaymentId,
        paidAt: new Date(),
      });
      await orderRepository.updatePaymentStatus(ourPayment.orderId, "COMPLETED");
      await orderRepository.updateStatus(ourPayment.orderId, "CONFIRMED");
      break;

    case "payment.failed":
      await paymentRepository.updateStatus(ourPayment.id, "FAILED", {
        transactionId: razorpayPaymentId,
      });
      await orderRepository.updatePaymentStatus(ourPayment.orderId, "FAILED");
      break;

    default:
      console.log(`[Webhook] Unhandled event: ${event}`);
  }

  return { received: true, processed: true };
};

/**
 * Legacy function for backward compatibility - creates mock payment session
 * POST /payments/create (deprecated, use /payments/create-order instead)
 */
export const createPaymentSession = async (paymentId: string) => {
  // Redirect to new Razorpay order creation
  return createRazorpayOrder(paymentId);
};

/**
 * GET /payments/:paymentId
 * Fetch payment details
 */
export const getPayment = async (paymentId: string, userId?: string) => {
  const payment = await paymentRepository.findById(paymentId);
  if (!payment) throw new PaymentError(404, "Payment not found");

  // Verify ownership if userId provided (client request)
  if (userId && payment.order.customerId !== userId) {
    throw new PaymentError(403, "Not your payment");
  }

  return payment;
};
