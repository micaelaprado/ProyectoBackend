const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const productsFilePath = './data/products.json';


const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};


const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
    const products = readJSONFile(productsFilePath);
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

router.get('/:pid', (req, res) => {
    const products = readJSONFile(productsFilePath);
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

router.post('/', (req, res) => {
    const products = readJSONFile(productsFilePath);
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send('All fields are required');
    }
    const newProduct = {
        id: uuidv4(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails
    };
    products.push(newProduct);
    writeJSONFile(productsFilePath, products);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const products = readJSONFile(productsFilePath);
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex === -1) {
        return res.status(404).send('Product not found');
    }
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const updatedProduct = { ...products[productIndex], title, description, code, price, status, stock, category, thumbnails };
    products[productIndex] = updatedProduct;
    writeJSONFile(productsFilePath, products);
    res.json(updatedProduct);
});

// DELETE 
router.delete('/:pid', (req, res) => {
    let products = readJSONFile(productsFilePath);
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex === -1) {
        return res.status(404).send('Product not found');
    }
    products = products.filter(p => p.id !== req.params.pid);
    writeJSONFile(productsFilePath, products);
    res.status(204).send();
});

module.exports = router;