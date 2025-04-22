import Cart from "../models/cart.model.js";

export default class CartDAO {
  async getById(id) {
    return await Cart.findById(id).populate("products.book");
  }

  async create(cartData) {
    return await Cart.create(cartData);
  }

  async update(id, data) {
    return await Cart.findByIdAndUpdate(id, data, { new: true });
  }

  async clearCart(id) {
    return await Cart.findByIdAndUpdate(id, { products: [] }, { new: true });
  }

  async updateProducts(cid, products) {
    return await Cart.findByIdAndUpdate(cid, { products }, { new: true });
  }
}
