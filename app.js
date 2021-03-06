const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverLay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const productsDOM = document.querySelector('.products-center');
const cartContent = document.querySelector('.cart-content');
const navIcon = document.querySelector('.nav-icon');
 
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
          <div data-item="${cart.id}">
            <i class="fas fa-chevron-up"></i>
            <p class="item-amount">${cart.count}</p>
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

//Show Cart Content
function showCartContent(btn) {
  btn.addEventListener('click', function () {
    toggleCart('visible', 'translateX(0)');
    const carts = new UI();
    cartContent.innerHTML = carts.displayCart(Storage.getCartStorage());
    const sum = Storage.getCartStorage().reduce((a, c) => {
      return a + c.price * c.count;
    }, 0);
    cartTotal.innerHTML = sum.toFixed(2);
  });
}

//DOMContentLoader
document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  
  if(Storage.getCartStorage() == null) {
    Storage.setCartStorage([]);
  }
  
  products.getProducts()
    .then((products) => {
      productsDOM.innerHTML = ui.displayProducts(products);
      Storage.setProductsStorage(products);
      cartItems.innerHTML = Storage.getCartStorage().length;
      const bagBtns = document.querySelectorAll('.bag-btn');
     
      bagBtns.forEach((bagBtn) => {
        bagBtn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const item = Storage.getCartStorage().find((p) => p.id == id);
          if (!item) {

            let cartStorage = Storage.getCartStorage();
            const cart = Storage.getProductsStorage().find((c) => c.id == id);
            //test
            cart.count = 1;
            cartStorage = [...cartStorage, cart];
            Storage.setCartStorage(cartStorage);
            cartItems.innerHTML = Storage.getCartStorage().length;
            e.target.disabled = true;
          }

          e.target.innerHTML = 'In Cart';
        });
      });

      //Show Cart Content
      showCartContent(cartBtn);
      
      //Close Cart Content
      closeCartBtn.addEventListener('click', function () {
        toggleCart('hidden', 'translateX(100%)');
      });

      //navIcon by showing
      showCartContent(navIcon);

    });

    cartContent.innerHTML = new UI().displayCart(Storage.getCartStorage());
});

cartOverLay.addEventListener("click", function(e){
  //remove item
  if (e.target.classList.contains('remove-item')) {
    const id = e.target.dataset.id;
    const cart = Storage.getCartStorage().filter((c) => c.id != id);
    cartContent.innerHTML = new UI().displayCart(cart);
    Storage.setCartStorage(cart);
    cartItems.innerHTML = Storage.getCartStorage().length;

    const sum = Storage.getCartStorage().reduce((a, c) => {
      return a + (c.price * c.count);
    }, 0);
    cartTotal.innerHTML = sum.toFixed(2);
  }

  //Clear Cart
  if(e.target.classList.contains("clear-cart")) {
    Storage.setCartStorage([]);
    cartContent.innerHTML="";
    cartTotal.innerHTML = Number("0").toFixed(2);
    cartItems.innerHTML = Storage.getCartStorage().length;
  }

  if(e.target.classList.contains("fa-chevron-up")) {
    const id = e.target.parentNode.dataset.item;
    const itemAmount = e.target.parentNode.querySelector('.item-amount');
    const cartStore = Storage.getCartStorage();
    cartStore.forEach((item, ind) => {

      if(item.id == id) {
        cartStore[ind].count++;
        itemAmount.innerHTML = cartStore[ind].count;
        const sum = cartStore.reduce((a, c) => {
          return a + (c.price * c.count);
        }, 0);
        cartTotal.innerHTML = sum.toFixed(2);
        console.log(cartStore[ind].count);
        Storage.setCartStorage(cartStore);
      }
    })
  }

  if (e.target.classList.contains('fa-chevron-down')) {
    const id = e.target.parentNode.dataset.item;
    const itemAmount = e.target.parentNode.querySelector('.item-amount');
    const cartStore = Storage.getCartStorage();
    cartStore.forEach((item, ind) => {
      if (item.id == id) {
        (cartStore[ind].count > 1) 
        ? cartStore[ind].count--
        : cartStore[ind].count;
        itemAmount.innerHTML = cartStore[ind].count;
        const sum = cartStore.reduce((a, c) => {
          return a + c.price * c.count;
        }, 0);
        cartTotal.innerHTML = sum.toFixed(2);
        console.log(cartStore[ind].count);
        Storage.setCartStorage(cartStore);
      }
    });
  }

});




