const { Router } = require('express');
const cartManager = require('../class/CartManager');
const productManager = require('../class/ProductManager');
const router = Router();
const pm = new productManager('./file/Products.json');
const cm = new cartManager('./file/Cart.json', pm);

router.post('/', async (req, res) => {
    try {
        const carts = await cm.getCarts();
        const cart = {
            id: carts.length + 1,
            products: []
        };
        carts.push(cart);
        await cm.writeCart(carts);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cm.getCartsById(cid);
        if (!cart) {
            res.status(404).json({ error: 'cart not found' });
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = parseInt(req.body.quantity) || 1;
        const product = await pm.getProductById(pid);
        if(!product) {
            res.status(404).json({ error: 'product not found' });
        }else{
            const cart = await cm.getCartsById(cid);
            if(!cart){
                res.status(404).json({ error: 'cart not found' });
            }else{
                await cm.addProductToCart(cart.id, product.id, quantity);
                res.status(200).json({ message: 'product added successfuly' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;