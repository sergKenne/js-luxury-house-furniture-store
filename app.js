const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverLay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const productsDOM = document.querySelector('.products-center');
const cartContent = document.querySelector('.cart-content');

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

  displayCart(carts) {
    return carts.map(cart => {
      return `
        <div class="cart-item">
          <img src="${cart.image}" alt="product" />
          <div>
            <h4>${cart.title}</h4>
            <h5>${cart.price}</h5>
            <span class="remove-item" data-id="${cart.id}">remove</span>
          </div>
          <div>
            <i class="fas fa-chevron-up"></i>
            <p class="item-amount">1</p>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
      `;
    }).join("\n");
  }
}

//local storage
class Storage {
  static setProductsStorage(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  static getProductsStorage() {
    return JSON.parse(localStorage.getItem('products'));
  }

  static setCartStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCartStorage() {
    return JSON.parse(localStorage.getItem('cart'));
  }
}


//Toggle Cart Content  function
function toggleCart (visibility, transform ) {
  cartOverLay.style.visibility = visibility;
  cartDOM.style.transform = transform;
}

//Remove products From Carts
function removeFromCart(id) {

}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  
  if(Storage.getCartStorage() == null) {
    Storage.setCartStorage([]);
  }
  
  products.getProducts().then(products => {
    productsDOM.innerHTML = ui.displayProducts(products);

    Storage.setProductsStorage(products);

    cartItems.innerHTML = Storage.getCartStorage().length;
    

    const bagBtns = document.querySelectorAll(".bag-btn");
    let cartStorage = Storage.getCartStorage();

    bagBtns.forEach(bagBtn => {
      bagBtn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const item = Storage.getCartStorage().find((p) => p.id == id);
        if(!item) {
          const cart =  Storage.getProductsStorage().find(c => c.id == id);
          console.log(cart);
          cartStorage = [ ...cartStorage, cart];
          Storage.setCartStorage(cartStorage);
          cartItems.innerHTML = Storage.getCartStorage().length;
          e.target.disabled = true;
        }

        e.target.innerHTML = "In Cart";
      })
    });

    //Show Cart Content
    cartBtn.addEventListener('click', function () {
      toggleCart("visible", "translateX(0)");
      const carts = new UI();
      cartContent.innerHTML = carts.displayCart(cartStorage);

      console.log(carts.displayCart(cartStorage))
    });

    //Close Cart Content
    closeCartBtn.addEventListener("click", function() {
      toggleCart('hidden', 'translateX(100%)');
    });

    //Romove Product from cart

     



     



  });
});
