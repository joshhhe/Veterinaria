<?php 
$host = "localhost";
$usuario ="root";
$contraseña = "";
$basedeDatos = "veterianaria";
 
//Aqui se hace la conexion a la base de datos , devolvera mensaje de error o de exito 
$conn = new mysqli($host,$usuario,$contraseña,$basedeDatos,3307);



?>