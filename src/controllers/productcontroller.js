import fs from 'fs';
import Product from '../models/product.js';
import { readJSONFile, writeJSONFile } from '../utils/fileUtils.js';
import { io } from '../app.js';  // Importa io desde app.js

const productsFilePath = './data/products.json';

// Resto del código ...

export const createProduct = (req, res) => {
  const products = readJSONFile(productsFilePath);
  const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send('All fields are required');
  }
  const newProduct = new Product(title, description, code, price, stock, category, thumbnails);
  products.push(newProduct);
  writeJSONFile(productsFilePath, products);
  io.emit('updateProducts', products);  // Emitir actualización de productos
  res.status(201).json(newProduct);
};

export const deleteProduct = (req, res) => {
  let products = readJSONFile(productsFilePath);
  const productIndex = products.findIndex(p => p.id === req.params.pid);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  products = products.filter(p => p.id !== req.params.pid);
  writeJSONFile(productsFilePath, products);
  io.emit('updateProducts', products);  // Emitir actualización de productos
  res.status(200).json({ message: 'Product deleted' });
};