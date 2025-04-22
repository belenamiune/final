import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import passport from "passport";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/book.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

dotenv.config();
const app = express();

connectDB();

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(passport.initialize());
app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
