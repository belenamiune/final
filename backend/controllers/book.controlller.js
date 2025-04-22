import BookRepository from "../repositories/Book.repository.js";

const bookRepository = new BookRepository();

export default class BookController {
  async getAllBooks(req, res) {
    try {
      const books = await bookRepository.getBooks();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los libros" });
    }
  }

  async getBookById(req, res) {
    const { id } = req.params;
    try {
      const book = await bookRepository.getBookById(id);
      if (!book) {
        return res.status(404).json({ message: "Libro no encontrado" });
      }
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el libro" });
    }
  }

  async createBook(req, res) {
    try {
      const bookData = req.body;
      const book = await bookRepository.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el libro" });
    }
  }

  async updateBook(req, res) {
    const { id } = req.params;
    try {
      const updatedBook = await bookRepository.updateBook(id, req.body);
      res.status(200).json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el libro" });
    }
  }

  async deleteBook(req, res) {
    const { id } = req.params;
    try {
      await bookRepository.deleteBook(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el libro" });
    }
  }
}
