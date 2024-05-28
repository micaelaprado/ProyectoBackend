import { v4 as uuidv4 } from 'uuid';

class Product {
  constructor(title, description, code, price, stock, category, thumbnails = []) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = true;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
  }
}

export default Product;