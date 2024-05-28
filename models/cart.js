import { v4 as uuidv4 } from 'uuid';

class Cart {
  constructor() {
    this.id = uuidv4();
    this.products = [];
  }

  addProduct(productId) {
    const product = this.products.find(p => p.productId === productId);
    if (product) {
      product.quantity += 1;
    } else {
      this.products.push({ productId, quantity: 1 });
    }
  }
}

export default Cart;