const horarios = document.getElementById("horas");
const motivo = document.getElementById("motivo");
const btn = document.getElementById("btn-agendar");
const formulario = document.getElementById("form-agenda");
const nombre = document.getElementById("nombre");
const mascota = document.getElementById("mascota");
const comuna = document.getElementById("comuna");
const region = document.getElementById("region");
const fecha = document.getElementById("fecha");
const grilla = document.getElementById("tabla-agenda");
const hoy = new Date();
const saludo = document.getElementById("saludo");
let validador = "";

//Realizo funcion para obtener horas
function cargarHorarios() {
  fetch("command.php?cmd=obtenerhorarios")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.idhora;
        option.textContent = element.descripcion;
        horarios.appendChild(option);
      });
    });
}

//funcion para limpiar formulario
function limpiarFormulario() {
  nombre.value = "";
  mascota.value = "";
  comuna.value = "";
  region.value = "";
  horarios.value = "";
  motivo.value = "";
  horarios.innerHTML = "<option value=''>--Seleccione--</option>";
  motivo.innerHTML = "<option value=''>--Seleccione--</option>";
  comuna.innerHTML = "<option value=''>--Seleccione--</option>";
  region.innerHTML = "<option value=''>--Seleccione--</option>";
  fecha.value = "";
  btn.textContent = "Agendar";
  btn.value = "";
}

//Realizo funcion que obtiene los datos del motivo de agenda
function cargarMotivos() {
  fetch("command.php?cmd=obtenermotivos")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.idmotivo;
        option.textContent = element.descripcionmotivo;
        motivo.appendChild(option);
      });
    });
}

//Cargo los select apenas se inicie la pagina
document.addEventListener("DOMContentLoaded", () => {
  cargarHorarios();
  cargarMotivos();
  obtenerRegiones();
  cargarGrilla();
  Swal.fire({
    html: '<p class="p-sw">Registre a su mascota para poder agendar una hora 🐶🐱</p>',
    icon: "info",
    customClass: {
      popup: "popup-class",
    },
    showClass: {
      popup: "animate__animated animate__fadeInLeft animate__slow",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutRight animate__slow",
    },
    confirmButtonText: "Aceptar",
  });
});

//Asigno evento al formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  //aqui verifico el boton, para ver si edito o inserto
  if (btn.textContent === "Actualizar") {
    const id = btn.value;
    const params = new URLSearchParams({
      cmd: "editarregistros",
      nombre: nombre.value,
      mascota: mascota.value,
      comuna: comuna.value,
      region: region.value,
      horarios: horarios.value,
      motivo: motivo.value,
      fecha: fecha.value,
      id: id,
    });

    if (validarDatos()) {
      const horaocupado = await validarhorarios(horarios.value, fecha.value);
      if (horaocupado) {
        return false;
      } else {
        const response = await fetch("command.php?" + params.toString());
        const data = await response.json();
        if (data.success && validarDatos()) {
          alert(data.mensaje);
          cargarGrilla();
          limpiarFormulario();
          obtenerRegiones();
          cargarHorarios();
          cargarMotivos();
        }
      }
      return;
    }
  }

  if (btn.textContent === "Agendar") {
    if (validarDatos()) {
      const horaocupado = await validarhorarios(horarios.value, fecha.value);
      if (horaocupado) {
        return false;
      } else {
        agendarHora();
        limpiarFormulario();
      }
    }
  }
});

//funcion para validar datos del formulario
function validarDatos() {
  const ahora = horarios.options[horarios.selectedIndex].textContent;
  const horaInicioStr = ahora.split("a")[0];
  const partes = horaInicioStr.split(":");
  const hora = parseInt(partes[0]);
  const minutos = parseInt(partes[1]);
  const minutosTotales = hora * 60 + minutos;
  const ahoraa = new Date();
  const minutosActuales = ahoraa.getHours() * 60 + ahoraa.getMinutes();
  const hoy = new Date();
  const actualHoy = hoy.getDate();

  const fechaSelec = fecha.value;
  const fechaActual = new Date().toISOString().split("T")[0];
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (nombre.value.trim() == "") {
    Swal.fire({
      title: "El campo nombre es obligatorio",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("El campo nombre es obligatorio");
    return false;
  } else if (!soloLetras.test(nombre.value)) {
    Swal.fire({
      title: "El campo solo acepta letras",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("El campo solo acepta letras");
    nombre.value = "";
    return false;
  }
  if (mascota.value.trim() == "") {
    Swal.fire({
      title: "El campo mascota es obligatorio",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("El campo mascota debe ser completado");
    return false;
  }

  if (horarios.value == "") {
    Swal.fire({
      title: "El campo horario es obligatorio",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("Debe selecionar un horario");
    return false;
  } else if (fechaSelec == fechaActual && minutosTotales < minutosActuales) {
    Swal.fire({
      title: "El horario debe ser menor al horario actual",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("El horario seleccionado no puede ser menor al horario actual");
    return false;
  }

  if (motivo.value == "") {
    Swal.fire({
      title: "Debe seleccionar un motivo",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("Debe seleccionar un motivo de consulta");
    return false;
  }
  if (region.value == "") {
    Swal.fire({
      title: "Debe seleccionar una región",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("Debe seelccionar  una region");
    return false;
  }

  if (comuna.value == "") {
    Swal.fire({
      title: "Debe seleccionar una comuna",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("Debe selecionar una comuna");
    return false;
  }

  if (fecha.value == "") {
    Swal.fire({
      title: "Debe seleccionar una fecha para agendar",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    //alert("Debe seelcionar una fecha para agendar");
    return false;
  } else if (fechaSelec < fechaActual) {
    Swal.fire({
      title: "La fecha no puede ser menor a hoy",
      icon: "error",
      customClass: {
        popup: "popup-class",
        header: "header-class",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__slow",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__slow",
      },
      confirmButtonText: "Aceptar",
    });
    // alert("la fecha no puede ser menor a hoy");
    return false;
  }

  return true;
}

function agendarHora() {
  const params = new URLSearchParams({
    cmd: "agendarhora",
    nombre: nombre.value,
    mascota: mascota.value,
    comuna: comuna.value,
    region: region.value,
    horarios: horarios.value,
    motivo: motivo.value,
    fecha: fecha.value,
  });
  const ani = document.getElementById("mascota").value;
  const nam = document.getElementById("nombre").value;

  fetch("command.php?" + params.toString())
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          title: "¡¡Hora agendada!!",
          html: `<p class="p-sw">La hora para <strong>${ani}🐾</strong> ya fue agendada. Le llegará un correo de confirmación, Sr/a <strong>${nam}</strong>.</p>`,
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
        //alert(data.mensaje);
        cargarGrilla();
      }
    });
}

function obtenerRegiones() {
  fetch("command.php?cmd=obtenerregion")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.idregion;
        option.textContent = element.nombre;
        region.appendChild(option);
      });
    });
}

function obtenerComunas(idregion, idcomunaSeleccionada = null) {
  fetch(
    `command.php?cmd=obtenercomunas&idregion=${encodeURIComponent(idregion)}`
  )
    .then((response) => response.json())
    .then((data) => {
      comuna.innerHTML = "Seleccione";
      data.forEach((elemento) => {
        const option = document.createElement("option");
        option.value = elemento.idcomuna;
        option.textContent = elemento.nombre;
        comuna.appendChild(option);
      });
      idcomunaSeleccionada
        ? (comuna.value = idcomunaSeleccionada)
        : (comuna.value = "");
    });
}

region.addEventListener("change", function () {
  obtenerComunas(region.value, "");
});

function cargarGrilla() {
  grilla.innerHTML = "";
  fetch("command.php?cmd=obteneregistros")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((elemento) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${elemento.nombre}</td>
          <td>${elemento.mascota}</td>
          <td>${elemento.fecha}</td>
          <td>${elemento.descripcion_hora}</td>
          <td>${elemento.descripcion_motivo}</td>       
        `;
        const accion = document.createElement("td");
        accion.appendChild(btnEliminar(elemento.idregistro));
        accion.appendChild(btnEditar(elemento.idregistro));
        fila.appendChild(accion);
        grilla.appendChild(fila);
      });
    });
}

function btnEliminar(idregistro) {
  const btn = document.createElement("button");
  btn.textContent = "Eliminar";
  btn.classList.add("btn-eliminar");
  btn.addEventListener("click", function () {
    eliminarRegistro(idregistro);
  });
  return btn;
}

function eliminarRegistro(idregistro) {
  fetch(
    `command.php?cmd=elimarregistro&idregistro=${encodeURIComponent(
      idregistro
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          title: "¡¡Hora Eliminada!!",
          html: `<p class="p-sw">La hora para <strong>${mascota.value}🐾</strong> ya fue eliminada. ¡La esperamos la próxima vez!</p>`,
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
        //alert(data.mensaje);

        cargarGrilla();
      }
    });
}

function btnEditar(idregistro) {
  const btn = document.createElement("button");
  btn.textContent = "Editar";
  btn.classList.add("btn-editar");
  btn.addEventListener("click", function () {
    editarRegistro(idregistro);
  });
  return btn;
}

function editarRegistro(idregistro) {
  fetch(
    `command.php?cmd=obtenerregistro&idregistro=${encodeURIComponent(
      idregistro
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      nombre.value = data.nombre;
      region.value = data.idregion;
      obtenerComunas(data.idregion, data.idcomuna);
      mascota.value = data.mascota;
      fecha.value = data.fecha;
      horarios.value = data.idhora;
      motivo.value = data.idmotivo;
    });

  btn.textContent = "Actualizar";
  btn.value = idregistro;
}

async function validarhorarios(idhora, fecha) {
  const params = new URLSearchParams({
    cmd: "validarhora",
    idhora: idhora,
    fecha: fecha,
  });
  const response = await fetch("command.php?" + params.toString());
  const data = await response.json();

  if (data.success) {
    alert(data.mensaje);
    return true;
  } else {
    return false;
  }
}
