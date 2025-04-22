import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  cartId: {
    type: String,
    default: () => Math.random().toString(36).substr(2, 9),
  },
});

export default mongoose.model("User", userSchema);
