import Book from "../models/book.model.js";

export default class BookDAO {
  async getAll() {
    return await Book.find();
  }

  async getById(id) {
    return await Book.findById(id);
  }

  async create(bookData) {
    return await Book.create(bookData);
  }

  async update(id, data) {
    return await Book.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Book.findByIdAndDelete(id);
  }
}
