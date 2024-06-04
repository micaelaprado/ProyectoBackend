import fs from 'fs';
import Product from '../models/Product.js';
import { io } from '../app.js';  

const productsFilePath = './data/products.json';

const readJSONFile = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getAllProducts = (req, res) => {
  const products = readJSONFile(productsFilePath);
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
};

export const getProductById = (req, res) => {
  const products = readJSONFile(productsFilePath);
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
};

export const createProduct = (req, res) => {
  const products = readJSONFile(productsFilePath);
  const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send('All fields are required');
  }
  const newProduct = new Product(title, description, code, price, stock, category, thumbnails);
  products.push(newProduct);
  writeJSONFile(productsFilePath, products);
  io.emit('updateProducts', products);  // Emite la actualización
  res.status(201).json(newProduct);
};

export const updateProduct = (req, res) => {
  const products = readJSONFile(productsFilePath);
  const productIndex = products.findIndex(p => p.id === req.params.pid);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  products[productIndex] = {
    ...products[productIndex],
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: thumbnails || products[productIndex].thumbnails
  };
  writeJSONFile(productsFilePath, products);
  io.emit('updateProducts', products);  // Emite la actualización
  res.json(products[productIndex]);
};

export const deleteProduct = (req, res) => {
  let products = readJSONFile(productsFilePath);
  const productIndex = products.findIndex(p => p.id === req.params.pid);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  products = products.filter(p => p.id !== req.params.pid);
  writeJSONFile(productsFilePath, products);
  io.emit('updateProducts', products);  // Emite la actualización
  res.status(200).send('Product deleted');
};