class ProductList {
  constructor(cart) {
    this.cart = cart;
    this.container = document.querySelector('.products-container');
    this.productService = new ProductsService();
    this.sortDirection = 'ascending';
    this.productService
      .getProducts()
      .then(() => this.renderProducts())
      .then(() => this.addEventListeners()); 
    document.querySelector('.search').addEventListener('keydown', async () => {
      await this.renderProducts();
      this.addEventListeners();
    });   
  }
  async renderProducts() {
    const searchInput = document.querySelector('.search');
    let productListDomString = '';
    const products = await this.productService.getProducts();
    [...products]
      .filter( product => product.title.includes(searchInput.value) )
      .sort( (a, b) => this.sortDirection === 'ascending' 
                         ? a.price - b.price
                         : b.price - a.price)
      .forEach(product => {
      productListDomString += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                  <div class="card product">
                    <img class="card-img-top" src="${product.image}" 
                        alt="${product.title}">
                    <div class="card-body d-flex flex-column">
                      <h4 class="card-title">${product.title}</h4>
                      <p class="card-text flex-fill">${product.description}</p>
                      <div class="d-flex justify-content-around">
                        <button class="btn btn-info" data-bs-toggle="modal"
                          data-bs-target="#productInfoModal" data-id="${product.id}">Info
                        </button>
                        <button class="btn btn-primary buy" data-id="${product.id}">
                          $${product.price} - Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>`;
    });
    this.container.innerHTML = productListDomString;
  }
  async addEventListeners() {
    document
      .querySelectorAll('.product .btn-info')
      .forEach(button =>
        button.addEventListener('click', event =>
          this.handleProductInfoClick(event)
        )
      );
    document
      .querySelectorAll(
        '.card.product button.buy, #productInfoModal button.buy'
      )
      .forEach(button =>
        button.addEventListener('click', event =>
          this.handleProductBuyClick(event)
        )
      );
    document.querySelector('.sort-asc').addEventListener('click', async () => {
        this.sortDirection = 'ascending';
        await this.renderProducts();
        this.addEventListeners();
    });
    document.querySelector('.sort-desc').addEventListener('click', async () => {
        this.sortDirection = 'descending';
        await this.renderProducts();
        this.addEventListeners();
    });
  }
  async handleProductInfoClick(event) {
    const button = event.target; // Button that triggered the modal
    const id = button.dataset.id; // Extract info from data-* attributes
    const product = await this.productService.getProductById(id);
    const modal = document.querySelector('#productInfoModal');
    const productImg1 = modal.querySelector('.modal-body .image-one');
    productImg1.setAttribute('src', product.additionalImages[0]);
    productImg1.setAttribute('alt', product.additionalImages[0]);
    const productImg2 = modal.querySelector('.modal-body .image-two');
    productImg2.setAttribute('src', product.additionalImages[1]);
    productImg2.setAttribute('alt', product.additionalImages[1]);
    modal.querySelector('.modal-body .card-title').innerText = product.title;
    modal.querySelector('.modal-body .card-text').innerText =
      product.description;
    const btnBuy = modal.querySelector('button.buy');
    btnBuy.innerText = `${product.price} - Buy`;
    btnBuy.dataset.id = id;
  }
  handleProductBuyClick(event) {
    const button = event.target;
    const id = button.dataset.id;
    this.cart.addProduct(id);
    window.showAlert('Product added to cart');
  }
}
