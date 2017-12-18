const cart = new Cart($('#cartModal'));
const productList = new ProductList('../products.json', $('.products-container'), cart);

function showAlert(message, success = true) {
    const alertTemplate = 
        `<div class="alert alert-dismissible ${success ? 'alert-success' : 'alert-danger'}" role="alert">
          <strong>${message}</strong> 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
          </button>
        </div>`;
    const alertElement = $('body').append(alertTemplate);
    alertElement.alert();
    setTimeout(() => {
        // console.log(alertElement);
        $('.alert').alert('close');
    }, 1000);
}
