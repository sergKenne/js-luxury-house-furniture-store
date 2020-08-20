// products from "./products.json"
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverLay = document.querySelector('.cart-averlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const productsDOM = document.querySelector('.products-center');

let cart = [];

//get products
class Products {
  async getProducts() {
    try{
      const result = await fetch('/products.json');
      const data = await result.json();
      const items = data.items;

      const products = items.map( item => {
        const {id} = item.sys 
        const {title,price} = item.fields;
        const image = item.fields.image.fields.file.url;
        return {
          title,
          price,
          image,
          id
        }
      });
      
      return products;
    } catch(err) {
      console.log(err.message);
    }
  }
}

//display product
class UI {
  displayProducts(products) {
    return products.map(
      (product) => `
      <article class="product">
        <div class="img-container">
          <img src="${product.image}" alt="product" class="product-img" />
          <button class="bag-btn" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i>
            add to bag
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
    `,
    ).join("\n");
  }
}

//local storage
class Storage {

}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();

  products.getProducts().then(products => {
    productsDOM.innerHTML = ui.displayProducts(products);
  });

});
