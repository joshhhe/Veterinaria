const btnLogin = document.getElementById("btn-login");
const correo = document.getElementById("floatingInput");
const contrasena = document.getElementById("floatingPassword");

btnLogin.addEventListener("click", async (e) => {
  e.preventDefault();
  if (correo.value == "") {
    alert("Ingrese algun Correo");
    return;
  }
  if (contrasena.value == "") {
    alert("Ingrese una contraseña");
    return;
  }

  const bandera = await login(correo.value, contrasena.value);
  if (bandera) {
    window.location.href = "home.html";
  } else {
    Swal.fire({
      title: `No existe el usuario`,
      html: `<p class="p-sw">El usuario no ha sido identificado en nuestros registros</p>`,
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
  }
  limpiarFormulario();
});

function limpiarFormulario() {
  correo.value = "";
  contrasena.value = "";
}

async function login(correo, contrasena) {
  const params = new URLSearchParams({
    cmd: "verificacionlogin",
    correoUser: correo,
    contrasenaUser: contrasena,
  });
  const response = await fetch("command.php?" + params.toString());
  const datos = await response.json();
  if (datos.success) {
    return true;
  } else {
    Swal.fire({
      title: `Login Fallido`,
      html: `<p class="p-sw">Su inicio de sesion no fue exitoso</p>`,
      icon: "success",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    return false;
  }
}
