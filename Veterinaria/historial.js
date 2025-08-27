import { obtenerDatosSesion } from "./home.js";
const grilla = document.getElementById("tabla-body");
let rut = "";

document.addEventListener("DOMContentLoaded", async () => {
  const datos = await obtenerDatosSesion();
  rut = datos.rut;
  await cargarGrillaPorUsuario();
});

async function cargarGrillaPorUsuario() {
  const params = new URLSearchParams({
    cmd: "grillaUsuario",
    rut: rut,
  });
  const response = await fetch("command.php?" + params.toString());
  const data = await response.json();

  grilla.innerHTML = "";

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((elemento) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${elemento.nombre}</td>
        <td>${elemento.mascota}</td>
        <td>${elemento.nombre_region}</td>
        <td>${elemento.nombre_comuna}</td>
        <td>${elemento.fecha}</td>
        <td>${elemento.descripcion_hora}</td>
        <td>${elemento.descripcion_motivo}</td>
      `;
      grilla.appendChild(fila);
    });
  } else {
    grilla.innerHTML =
      "<tr><td colspan='6'>No hay registros para este usuario, pero puede agendar una hora en nuestro Home en el boton de servicios</td></tr>";
  }
}
