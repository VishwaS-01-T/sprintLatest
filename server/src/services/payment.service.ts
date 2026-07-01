import stripe, { IS_PRODUCTION } from "../lib/stripe.js";
import { paymentRepository } from "../repositories/payment.repository.js";
import { orderRepository } from "../repositories/order.repository.js";
import { AppError } from "../utils/AppError.js";

export class PaymentError extends AppError {}

export const createRazorpayOrder = async (paymentId: string) => {
  const payment = await paymentRepository.findById(paymentId);
  if (!payment) throw new PaymentError(404, "Payment not found");
  if (payment.paymentStatus !== "PENDING") {
    throw new PaymentError(400, "Payment is not in pending state");
  }

  if (!stripe) {
    if (IS_PRODUCTION) throw new PaymentError(500, "Stripe not configured");
    // Mock successful payment link for dev
    return { url: `/orders/${payment.orderId}` };
  }

  const frontendUrl = !IS_PRODUCTION ? "http://localhost:5174" : process.env.FRONTEND_URL;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: payment.currency || "inr",
          product_data: { name: `Order #${payment.orderId}` },
          unit_amount: Math.round(payment.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${frontendUrl}/orders/${payment.orderId}?payment=success`,
    cancel_url: `${frontendUrl}/checkout?payment=cancelled`,
    client_reference_id: payment.id,
  });

  await paymentRepository.updateTransactionId(payment.id, session.id);
  return { url: session.url };
};

export const verifyPayment = async (payload: { paymentId: string; sessionId?: string }) => {
  const payment = await paymentRepository.findById(payload.paymentId);
  if (!payment) throw new PaymentError(404, "Payment not found");

  if (stripe && payment.transactionId) {
    const session = await stripe.checkout.sessions.retrieve(payment.transactionId);
    if (session.payment_status === "paid") {
      await paymentRepository.updateStatus(payment.id, "COMPLETED", { paidAt: new Date() });
      await orderRepository.updatePaymentStatus(payment.orderId, "COMPLETED");
      await orderRepository.updateStatus(payment.orderId, "CONFIRMED");
    }
  } else if (!IS_PRODUCTION) {
    // Mock success for dev
    await paymentRepository.updateStatus(payment.id, "COMPLETED", { paidAt: new Date() });
    await orderRepository.updatePaymentStatus(payment.orderId, "COMPLETED");
    await orderRepository.updateStatus(payment.orderId, "CONFIRMED");
  }

  return { success: true, paymentId: payment.id, orderId: payment.orderId };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleWebhook = async (payload: any) => {
  // Simplification: In a real app we would verify the Stripe signature here.
  const event = payload;
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const payment = await paymentRepository.findById(session.client_reference_id);
    if (payment) {
      await paymentRepository.updateStatus(payment.id, "COMPLETED", { paidAt: new Date() });
      await orderRepository.updatePaymentStatus(payment.orderId, "COMPLETED");
      await orderRepository.updateStatus(payment.orderId, "CONFIRMED");
    }
  }
  return { received: true, processed: true };
};

export const createPaymentSession = async (paymentId: string) => {
  return createRazorpayOrder(paymentId);
};

export const getPayment = async (paymentId: string, userId?: string) => {
  const payment = await paymentRepository.findById(paymentId);
  if (!payment) throw new PaymentError(404, "Payment not found");
  if (userId && payment.order.customerId !== userId) {
    throw new PaymentError(403, "Not your payment");
  }
  return payment;
};
