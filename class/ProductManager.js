const fs = require('fs')


class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path

    }

    async addProduct(product) {
        try {
            const products = await this.readFileProducts();
            const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
            product.id = lastProductId + 1;
            products.push(product)
            this.writeFileProducts(products)
        }
        catch (err) {
            console.log(err)
        }
    }

    getProducts() {
        return this.readFileProducts();
    }

    getProductById(id) {
        const products = this.readFileProducts();
        const product = products.find(product => product.id == id);

        return product || null
    }

    updateProduct(id, updatedProduct) {
        const products = this.readFileProducts();

        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            products[productIndex] = Object.assign({}, products[productIndex], updatedProduct, { id });
            this.writeFileProducts(products);
        }
    }

    deleteProduct(id) {
        const products = this.readFileProducts();
        const index = products.filter(product => product.id !== id)
        this.writeFileProducts(index)
    }

    readFileProducts() {
        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, "[]");
            }
            const productsData = fs.readFileSync(this.path, 'utf-8');
            const products = JSON.parse(productsData);
            return products;
        }
        catch (error) {
            console.log(error)
            return [];
        }
    }


    writeFileProducts(products) {
        fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));
    }

}

module.exports = ProductManager