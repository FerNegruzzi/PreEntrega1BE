const fs = require('fs');

class CartManager {
    constructor(path,pm){
    this.path = path;
    this.productManager = pm;
}

addProductToCart(cartId, productId, quantity){
    const carts = this.readCart();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);

    if(cartIndex !== -1){
        const cart = carts[cartIndex];
        const product = this.productManager.getProductById(productId);

        if(product) {
            const existingProductIndex = cart.products.findIndex(product => product.id === productId);
            if(existingProductIndex !== -1){
                cart.products[existingProductIndex].quantity += quantity;
            }else{
                cart.products.push({ id: productId, quantity });
            }
            this.writeCart(carts);
        }
    }
}

getCarts(){
    return this.readCart();
}

getCartsById(id) {
    const carts = this.readCart();
    const cart = carts.find((cart) => cart.id == id);

    return cart || null;
}

readCart() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.writeFileSync(this.path, "[]");
      }
      const cartsData = fs.readFileSync(this.path, "utf-8");
      const carts = JSON.parse(cartsData);
      return carts;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  writeCart(carts) {
    fs.writeFileSync(this.path, JSON.stringify(carts, null, '\t'));
  }
}

module.exports = CartManager;