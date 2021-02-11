import toastr from 'toastr'

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  export function popUp(title, message, type){
    toastr[type](message, title)
  }

  export function successPopUp(message){
      popUp("Sucesso", message, "success")
  }

  export function warningPopUp(message){
      popUp("Alerta", message, "warning")
  }
  export function infoPopUp(message){
      popUp("Info", message, "info")
  }

  export function errorPopUp(message){
      popUp("Erro", message, "error")
  }