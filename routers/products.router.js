const { Router } = require('express');
const productManager = require('../class/ProductManager');
const router = Router()
const productsFile = new productManager('./file/Products.json')

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productsFile.getProducts();
        const productsLimit = limit ? products.slice(0, limit) : products;
        res.json({ products: productsLimit })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productsFile.getProductById(pid);
        if (!product) {
            res.status(404).json({ error: `product with id ${pid} not found` });
        } else {
            res.json({ product })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', (req, res) => {
    try {
        const products = productsFile.readFileProducts()
        const { title, description, code, price, status = true, stock, category, thumbnail } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            return res.status(400).json({ message: "Un producto no se agrego correctamente. Todos los campos son obligatorios" });
        }
        if (products.some(productCode => productCode.code === code)) {
            return res.status(400).json({ message: "No se pudo agregar un objeto. Ese code ya esta registrado" })
        }

        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        }
        products.push(newProduct)
        productsFile.writeFileProducts(products)
        res.send({ message: 'product added' })
    } catch (error) {
        console.log(error);
    }
});

router.patch('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = req.body;
    productsFile.updateProduct(pid, updatedProduct);
    res.send('product updated succesfuly')
});

router.delete('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    productsFile.deleteProduct(pid);
    res.send('product deleted')
});
module.exports = router