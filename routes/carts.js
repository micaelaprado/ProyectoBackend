const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const cartsFilePath = './data/carts.json';

const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

router.post('/', (req, res) => {
    const carts = readJSONFile(cartsFilePath);
    const newCart = {
        id: uuidv4(),
        products: []
    };
    carts.push(newCart);
    writeJSONFile(cartsFilePath, carts);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const carts = readJSONFile(cartsFilePath);
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Cart not found');
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = readJSONFile(cartsFilePath);
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).send('Cart not found');
    }
    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
    if (productIndex === -1) {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    } else {
        cart.products[productIndex].quantity += 1;
    }
    writeJSONFile(cartsFilePath, carts);
    res.status(200).json(cart);
});

module.exports = router;