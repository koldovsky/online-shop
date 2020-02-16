function showAlert(message, success = true) {
  const alertTemplate = `<div class="alert alert-dismissible ${
    success ? 'alert-success' : 'alert-danger'
  }" role="alert">
          <strong>${message}</strong> 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
          </button>
        </div>`;
  const alertElement = $('body').append(alertTemplate);
  alertElement.alert();
  setTimeout(() => {
    $('.alert').alert('close');
  }, 2000);
}
