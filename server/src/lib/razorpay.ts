/**
 * Razorpay Client Configuration
 *
 * Provides a configured Razorpay instance for payment processing.
 * Uses environment variables for API keys.
 */

import Razorpay from "razorpay";
import crypto from "crypto";

// ─── Environment Variables ──────────────────────────────────────────────────────

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn(
    "[Razorpay] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET. Payment features will not work.",
  );
}

// ─── Razorpay Instance ──────────────────────────────────────────────────────────

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export default razorpay;

// ─── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Verify Razorpay payment signature
 * Uses HMAC SHA256 to verify the payment callback signature
 */
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
): boolean => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
};

/**
 * Get Razorpay key ID for client-side checkout
 */
export const getRazorpayKeyId = (): string => RAZORPAY_KEY_ID;
