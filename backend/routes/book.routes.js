import express from "express";
import BookController from "../controllers/book.controlller.js";
import { isAuthenticated } from "../config/passport.config.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
const bookController = new BookController();

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", isAuthenticated, isAdmin, bookController.createBook);
router.put("/:id", isAuthenticated, isAdmin, bookController.updateBook);
router.delete("/:id", isAuthenticated, isAdmin, bookController.deleteBook);

export default router;
