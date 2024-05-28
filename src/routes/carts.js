import { Router } from 'express';
import { createCart, getCartById, addProductToCart } from '../controllers/cartcontroller.js';

const router = Router();

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);

export default router;