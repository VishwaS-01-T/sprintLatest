import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(morgan("dev"));

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import orderRouter from "./routes/order.routes.js";
import returnRouter from "./routes/return.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import addressRouter from "./routes/address.routes.js";
import paymentMethodRouter from "./routes/payment-method.routes.js";
import reviewRouter from "./routes/review.routes.js";
import { globalErrorHandler } from "./middlewares/errorHandler.middleware.js";

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", orderRouter);
app.use("/api/returns", returnRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/payment-methods", paymentMethodRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/user/addresses", addressRouter);

import fs from "fs";
import path from "path";
import multer from "multer";

const SETTINGS_FILE = path.join(process.cwd(), "settings.json");
const uploadsDir = path.join(process.cwd(), "..", "client", "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads statically for production
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});
const upload = multer({ storage: storage });

app.post("/api/settings/upload", upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});

app.get("/api/settings/landing-page", (req, res) => {
  if (fs.existsSync(SETTINGS_FILE)) return res.json(JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8")));
  res.json({ 
    heroBackground: "https://plus.unsplash.com/premium_photo-1762745549473-a47f75a4946c?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    heroShoe: "/assets/shoes/shoe-10.png",
    video1: "/assets/Videos/highlightFirstVideo.mp4",
    video2: "/assets/Videos/highlightSecondVideo.mp4",
    video3: "/assets/Videos/highlightThirdVideo.mp4",
    video4: "/assets/Videos/highlightFourthVideo.mp4",
    mensCollectionImage: "/assets/shoes/shoe-10.png",
    womensCollectionImage: "/assets/shoes/shoe-12.avif",
    newArrivalsBgImage: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1920&q=80",
    newArrivalsShoeImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1280&q=80"
  });
});
app.post("/api/settings/landing-page", (req, res) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(req.body));
  res.json({ success: true });
});

// 404 handler (before error handler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler (MUST be last)
app.use(globalErrorHandler);

app.listen(port, () =>
  console.log(
    "Server is working on Port:" + port + " in " + envMode + " Mode.",
  ),
);
