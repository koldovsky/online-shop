function showAlert(message, success = true) {
  const alertTemplate = `<div class="alert ${
            success ? 'alert-success' : 'alert-danger'
        } alert-dismissible fade show" role="alert">
        <strong>${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
   </div>`  
  document.querySelector('.alert-container').innerHTML += alertTemplate;
  const alertElement = document.querySelector('.alert');
  const bsAlert = new bootstrap.Alert(alertElement);
  setTimeout( () => bsAlert.close(), 2000);
}
