import fs from 'fs';
import Cart from '../models/cart.js';

const cartsFilePath = './data/carts.json';

const readJSONFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const createCart = (req, res) => {
  const carts = readJSONFile(cartsFilePath);
  const newCart = new Cart();
  carts.push(newCart);
  writeJSONFile(cartsFilePath, carts);
  res.status(201).json(newCart);
};

export const getCartById = (req, res) => {
  const carts = readJSONFile(cartsFilePath);
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).send('Cart not found');
  }
};

export const addProductToCart = (req, res) => {
  const carts = readJSONFile(cartsFilePath);
  const cart = carts.find(c => c.id === req.params.cid);
  if (!cart) {
    return res.status(404).send('Cart not found');
  }
  cart.addProduct(req.params.pid);
  writeJSONFile(cartsFilePath, carts);
  res.status(200).json(cart);
};