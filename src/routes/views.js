import { Router } from 'express';
import { readJSONFile } from '../utils/fileUtils.js';

const router = Router();

router.get('/', (req, res) => {
  const products = readJSONFile('./data/products.json');
  res.render('index', { products });
});

router.get('/realtimeproducts', (req, res) => {
  const products = readJSONFile('./data/products.json');
  res.render('realTimeProducts', { products });
});

export default router;