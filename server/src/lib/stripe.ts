import Stripe from "stripe";


const HAS_STRIPE_CONFIG = !!(
  process.env.STRIPE_SECRET_KEY
);

// We need a fallback for development/testing if keys aren't provided
// In production, this should throw an error if keys are missing
if (!HAS_STRIPE_CONFIG && process.env.NODE_ENV === "production") {
  throw new Error("Stripe keys are required in production");
}

const stripe = HAS_STRIPE_CONFIG
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      // Removed apiVersion to use latest from typings
    })
  : null;

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default stripe;
