const nombreUser = document.getElementById("nombre-registro");
const correoUser = document.getElementById("correo-registro");
const rutUser = document.getElementById("rut-registro");
const contrasenaUser = document.getElementById("password-registro");
const formularioRegistro = document.getElementById("form-registro");
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

formularioRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();
  const bandera = validarRut(rutUser.value);
  console.log(bandera);

  if (validarUser() && validarRut(rutUser.value)) {
    let semaforo = await validarRutUnico(rutUser.value);
    if (semaforo) {
      rutUser.value = "";
      return false;
    } else {
      validarUser();
      guardarUser();
      window.location.href = "login.html";
    }
  }

  limpiarFormulario();
});

async function guardarUser() {
  const parametros = new URLSearchParams({
    cmd: "guardarUsuario",
    nombreUser: nombreUser.value,
    correoUser: correoUser.value,
    rutUser: rutUser.value,
    contrasenaUser: contrasenaUser.value,
  });
  const response = await fetch("command.php?" + parametros.toString());
  const datos = await response.json();
  if (datos.success) {
    Swal.fire({
      title: `Bienvenido ${nombreUser}`,
      html: `<p class="p-sw">Se registro correctamente</p>`,
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
    return true;
  } else {
    Swal.fire({
      title: `Registro Fallido`,
      html: `<p class="p-sw">No pudo registrarse de forma correcta, vuelva a intentarlo</p>`,
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
    return false;
  }
}

//validar los inputs de los usuarios
function validarUser() {
  if (nombreUser.value == "") {
    alert("El nombre no puede estar vacio");
    return false;
  }

  if (correoUser.value == "") {
    alert("El correo no puede estar vacio");
    return false;
  } else if (!correoRegex.test(correoUser.value)) {
    alert("Debe ingresar un correo valido");
    return false;
  }

  if (contrasenaUser.value == "") {
    alert("La contraseña no puede estar vacia");
    return false;
  } else if (!contrasenaRegex.test(contrasenaUser.value)) {
    alert("Contraseña no cumple los requisitos ");
    return false;
  }

  if (rutUser.value == "") {
    alert("El rut no puede estar vacio");
    return false;
  } else if (!validarRut(rutUser.value)) {
    alert("Rut incorrecto");
    return false;
  }

  return true;
}

//que el rut cumpla el formato correcto en chile
function validarRut(rut) {
  // Limpiar rut: eliminar puntos y guiones
  const rutLimpio = rut.replace(/[\.\-]/g, "").toUpperCase();

  // Validar formato básico: debe tener al menos 2 caracteres
  if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) {
    return false;
  }

  // Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);

  // Calcular dígito verificador esperado
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const res = 11 - (suma % 11);
  let dvEsperado = "";

  if (res === 11) dvEsperado = "0";
  else if (res === 10) dvEsperado = "K";
  else dvEsperado = res.toString();

  return dv === dvEsperado;
}

//verificar que el rut ingresado sea unico por usuario
async function validarRutUnico(rut) {
  const params = new URLSearchParams({
    cmd: "validarRut",
    rutUser: rut,
  });
  const response = await fetch("command.php?" + params.toString());
  const datos = await response.json();
  if (datos.success) {
    Swal.fire({
      title: `Registro Fallido`,
      html: `<p class="p-sw">Rut ya existe</p>`,
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
    return true;
  } else {
    return false;
  }
}

function limpiarFormulario() {
  nombreUser.value = "";
  correoUser.value = "";
  rutUser.value = "";
  contrasenaUser.value = "";
}
