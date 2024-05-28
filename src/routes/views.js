import { Router } from 'express';
import { readJSONFile } from '../utils/fileUtils.js';

const router = Router();

router.get('/', (req, res) => {
  const products = readJSONFile('./data/products.json');
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;