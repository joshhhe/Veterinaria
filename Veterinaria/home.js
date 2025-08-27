const btnLogOut = document.getElementById("btn-logout");
let sesionId = "";
const linkRegistro = document.getElementById("link-registro");
const linkCerrarSesion = document.getElementById("link-logOut");
const linkHistorial = document.getElementById("link-historial");
const linkIniciarSesion = document.getElementById("link-iniciar-sesion");

document.addEventListener("DOMContentLoaded", async () => {
  await obtenerDatosSesion();
  await verificarAgendamientos();
});

export async function obtenerDatosSesion() {
  const params = new URLSearchParams({
    cmd: "obtenerDatosLogin",
  });
  const response = await fetch("command.php?" + params.toString());
  const data = await response.json();
  if (data.success) {
    console.log(data);
    linkRegistro.style.display = "none";
    linkHistorial.style.display = "block";
    linkCerrarSesion.style.display = "block";
    // linkIniciarSesion.style.display = "none";

    if (!sessionStorage.getItem("swalHomeMostrado")) {
      Swal.fire({
        title: `Bienvenido ${data.nombre}`,
        html: `<p class="p-sw">Su inicio de sesion fue exitoso, bienvenido a la web VetVida</p>`,
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
      sessionStorage.setItem("swalHomeMostrado", "true");
    }
  } else {
    linkCerrarSesion.style.display = "none";
    linkHistorial.style.display = "none";
    linkRegistro.style.display = "block";
    linkIniciarSesion.style.display = "block";
    console.log("No hay sesion activa");
  }

  return data;
}

btnLogOut.addEventListener("click", async () => {
  const params = new URLSearchParams({
    cmd: "cerrarSesion",
  });
  const response = await fetch("command.php?" + params.toString());
  console.log(sesionId);
  const data = await response.json();
  if (data.success) {
    sessionStorage.removeItem("swalHomeMostrado");
    Swal.fire({
      title: `Sesion Cerrada`,
      html: `<p class="p-sw">Su sesion ha sido cerrada exitosamente</p>`,
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
    window.location.href = "login.html";
  } else {
    alert(data.mensaje);
  }
});

//crear funcion que verifique si los agendamientos de los usuarios son mañana a comparacion del dia de hoy , si es asi, mostrar un mensaje recordatorio
export async function verificarAgendamientos() {
  const params = new URLSearchParams({
    cmd: "verificarAgendamientos",
  });
  const response = await fetch("command.php?" + params.toString());
  const data = await response.json();
  console.log(data);
  if (data.success) {
    Swal.fire({
      title: `Recordatorio de Agendamiento`,
      html: `<p class="p-sw">Tiene un agendamiento programado para mañana. ¡No olvide asistir!</p>`,
      icon: "info",
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
}
