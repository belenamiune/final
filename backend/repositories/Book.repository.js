import BookDAO from "../dao/Book.dao.js";

const bookDAO = new BookDAO();

export default class BookRepository {
  async getBooks() {
    return await bookDAO.getAll();
  }

  async getBookById(id) {
    return await bookDAO.getById(id);
  }

  async createBook(data) {
    return await bookDAO.create(data);
  }

  async updateBook(id, data) {
    return await bookDAO.update(id, data);
  }

  async deleteBook(id) {
    return await bookDAO.delete(id);
  }
}
