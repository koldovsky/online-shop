class Cart {
  constructor() {
    this.productService = new ProductsService();
    this.cartContainer = document.querySelector('#modal-cart');
    this.cart = JSON.parse(localStorage['cart'] || '{}');
    this.addEventListeners();
    this.updateBadge();
  }
  addEventListeners() {
    document
      .querySelector('.openCartLink')
      .addEventListener('click', () => this.renderCart());
    this.cartContainer
      .querySelector('.order')
      .addEventListener('click', ev => this.order(ev));
  }
  saveCart() {
    localStorage['cart'] = JSON.stringify(this.cart);
  }
  async renderCart() {
    let total = 0;
    let cartDomSting = `<div class="container">
                <div class="row">
                    <div class="col-5"><strong>Product</strong></div>
                    <div class="col-3"><strong>Price</strong></div>
                    <div class="col-2"><strong>Quantity</strong></div>
                </div>`;
    for (const id in this.cart) {
      const product = await this.productService.getProductById(id);
      total += product.price * this.cart[id];
      cartDomSting += `<div class="row" data-id="${id}"> 
                    <div class="col-5">${product.title}</div>
                    <div class="col-3">${product.price}</div>
                    <div class="col-2">${this.cart[id]}</div>
                    <div class="col-1"><button data-id=${id} class="btn btn-sm plus">+</button></div>
                    <div class="col-1"><button data-id=${id} class="btn btn-sm minus">-</button></div>
                </div>`;
    }
    cartDomSting += `
                <div class="row">
                    <div class="col-5"><strong>TOTAL</strong></div>
                    <div class="col-3"><strong>$${total.toFixed(2)}</strong></div>
                </div>            
        </div>`;
    this.cartContainer.querySelector(
      '.cart-product-list-container'
    ).innerHTML = cartDomSting;
    this.cartContainer
      .querySelectorAll('.plus')
      .forEach(el =>
        el.addEventListener('click', ev =>
          this.changeQuantity(ev, this.addProduct)
        )
      );
    this.cartContainer
      .querySelectorAll('.minus')
      .forEach(el =>
        el.addEventListener('click', ev =>
          this.changeQuantity(ev, this.deleteProduct)
        )
      );
  }
  changeQuantity(ev, operation) {
    const button = ev.target;
    const id = button.dataset.id;
    operation.call(this, id);
    this.renderCart();
  }
  addProduct(id) {
    this.cart[id] = (this.cart[id] || 0) + 1;
    this.saveCart();
    this.updateBadge();
  }
  deleteProduct(id) {
    if (this.cart[id] > 1) {
      this.cart[id] -= 1;
    } else {
      delete this.cart[id];
    }
    this.saveCart();
    this.updateBadge();
  }
  async updateBadge() {
    const {count, cost } = await this.cartLengthAndCost(); 
    document.querySelector('#cart-badge').innerText = `${count} $${cost.toFixed(2)}`;
    if (count === 0) {
      document.querySelector("#navbarNav > div").classList.add('d-none'); 
    } else {
      document.querySelector("#navbarNav > div").classList.remove('d-none'); 
    }
  }
  async cartLengthAndCost() {
    // return Object.keys(this.cart).length;
    let count = 0;
    let cost = 0;
    // const productService = new ProductsService();
    for (const key in this.cart) {
        const product = await this.productService.getProductById(key);
        const quantity = this.cart[key]; 
        count += quantity;
        cost += quantity * product.price;
    }
    return {
        count, cost
    };
  }
  async order(ev) {
    if ((await this.cartLengthAndCost()).count === 0) {
      window.showAlert('Please choose products to order', false);
      return;
    }    
    const form = this.cartContainer.querySelector('.form-contacts');
    if (form.checkValidity()) {
      ev.preventDefault();
      fetch('order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientName: document.querySelector('#client-name').value,
          clientEmail: document.querySelector('#client-email').value,
          cart: this.cart
        })
      })
        .then(response => {
          if (response.status === 200) {
            return response.text();
          } else {
            throw new Error('Cannot send form');
          }
        })
        .then(responseText => {
          form.reset();
          this.cart = {};
          this.saveCart();
          this.updateBadge();
          this.renderCart();
          window.showAlert('Thank you! ' + responseText);
          this.cartContainer.querySelector('.close-btn').click();
        })
        .catch(error => showAlert('There is an error: ' + error, false));
    } else {
      window.showAlert('Please fill form correctly', false);
    }
  }
}
