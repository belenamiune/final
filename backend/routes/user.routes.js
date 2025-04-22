import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  changeUserRole,
} from "../controllers/user.controller.js";
import { isAuthenticated, isAdmin } from "../config/passport.config.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", isAuthenticated, getCurrentUser);
router.put("/role/:email", isAuthenticated, isAdmin, changeUserRole);
export default router;
