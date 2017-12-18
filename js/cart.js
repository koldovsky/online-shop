class Cart {
    constructor(cartContainer) {
        this.cartContainer = cartContainer;
        this.cart = JSON.parse(localStorage['cart'] || '{}');
        this.addEventListeners();
        this.updateBadge();
    }
    addEventListeners() {
        this.cartContainer.on('show.bs.modal', () => this.renderCart() );
        this.cartContainer.find('.order').click( ev => this.order(ev) );
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
    saveCart() {
        localStorage['cart'] = JSON.stringify(this.cart);
    }
    renderCart() {
        let total = 0;
        let cartDomSting = 
            `<div class="container">
                <div class="row">
                    <div class="col-5"><strong>Product</strong></div>
                    <div class="col-3"><strong>Price</strong></div>
                    <div class="col-2"><strong>Quantity</strong></div>
                </div>`;
        for (const id in this.cart) {
            const product = productList.getProductById(id);
            total += product.price * this.cart[id];
            cartDomSting += 
                `<div class="row" data-id="${id}"> 
                    <div class="col-5">${product.title}</div>
                    <div class="col-3">${product.price}</div>
                    <div class="col-2">${this.cart[id]}</div>
                    <div class="col-1"><button class="btn btn-sm plus">+</button></div>
                    <div class="col-1"><button class="btn btn-sm minus">-</button></div>
                </div>`;
        }
        total = total.toFixed(2);
        cartDomSting += `
                <div class="row">
                    <div class="col-5"><strong>TOTAL</strong></div>
                    <div class="col-3"><strong>$${total}</strong></div>
                </div>            
        </div>`;
        this.cartContainer.find('.cart-product-list-container').html(cartDomSting);
        this.cartContainer.find('.plus').click( ev => this.changeQuantity(ev, this.addProduct) );
        this.cartContainer.find('.minus').click( ev => this.changeQuantity(ev, this.deleteProduct) );
    }
    changeQuantity(ev, operation) {
        const button = $(ev.target);
        const id = button.parent().parent().data('id');
        operation.call(this, id);
        this.renderCart();
    }
    updateBadge() {
        $('#cart-badge').text(Object.keys(this.cart).length);
    }
    order(ev) {
        const form  = this.cartContainer.find('form')[0];
        if (form.checkValidity()) {
            ev.preventDefault();
            $.ajax({
                url: "https://formspree.io/YOUR_EMAIL_HERE", 
                method: "POST",
                data: {
                    clientName: $('#client-name').val(),
                    clientEmail: $('#client-email').val(),
                    cart: this.cart
                },
                dataType: "json"
            })
             .done( () => {
                 form.reset();
                 this.cart = {};
                 this.saveCart();
                 this.updateBadge();
                 this.renderCart();
                 window.showAlert('Thank you for your order');
                 this.cartContainer.modal('hide');
             } )
             .fail( () =>
                 window.showAlert('Sorry, there is error. Please try again later', false)
             );    
        } else {
            window.showAlert('Please fill all fields', false);
        }
    }
}
