<?php 

session_start();
include 'conexion.php';
require_once 'correos.php';


function mysqli_fetch_all_assoc($result) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
}

$cmd = $_REQUEST['cmd'];

switch ($cmd) {
    case 'obtenerhorarios':
        $query  = "SELECT idhora, descripcion FROM horas";
        $result = $conn->query($query);
        $error  = $conn->error;

        if($error){
            echo "error:".$error;
        }
        $data = mysqli_fetch_all_assoc($result);
        echo json_encode($data);
        break;

    case 'obtenermotivos':
        $query  = "SELECT idmotivo, descripcionmotivo FROM motivo";
        $result = $conn->query($query);
        $error  = $conn->error;

        if($error){
            echo "error:".$error;
        }

        $data   = mysqli_fetch_all_assoc($result);
        echo json_encode($data);
        break;
    case 'obtenerregion':
        $query  = "SELECT idregion, nombre FROM regiones";
        $result = $conn->query($query);
        $error  = $conn->error;
         if($error){
            echo "error:".$error;
        }

        $data   = mysqli_fetch_all_assoc($result);
        echo json_encode($data);
        break;
    case 'obtenercomunas':
        $idregion = $_REQUEST['idregion'];
        $query    = $conn -> prepare("SELECT idcomuna, nombre, idregion FROM comunas WHERE idregion = ?");
        $query    -> bind_param("i",$idregion);
        $query    ->execute();

        $data = $query->get_result();
        echo json_encode(mysqli_fetch_all_assoc($data));
        break;


    // case 'agendarhora':
    // // Recibe el objeto JSON enviado por fetch
    // $datos = json_decode(file_get_contents("php://input"), true);

    // // Ejemplo de cómo acceder a los datos
    // $nombre   = $datos['nombre'] ?? '';
    // $mascota  = $datos['mascota'] ?? '';
    // $comuna   = $datos['comuna'] ?? '';
    // $region   = $datos['region'] ?? '';
    // $horarios = $datos['horarios'] ?? '';
    // $motivo   = $datos['motivo'] ?? '';
    // $fecha    = $datos['fecha'] ?? '';

    // $query     ="INSERT INTO registros(nombre,mascota,idregion,idcomuna,fecha,idhora,idmotivo) VALUES ('$nombre', '$mascota', $region, $comuna, '$fecha', $horarios, $motivo)";
    // $result    =$conn->query($query);
    // // Devuelve respuesta
    // echo json_encode(['success' => $result, 'msg' => 'Hora agendada']);
    // break;

    case 'agendarhora':
        if(!isset($_SESSION["rut"])){
            echo json_encode([
                "success" => false,
                "mensaje" => "Debe iniciar sesion para agendar  una hora"
            ]);
            exit;
        }
        $nombre    = $_REQUEST['nombre'];
        $mascota   = $_REQUEST['mascota'];
        $comuna    = $_REQUEST['comuna'];
        $region    = $_REQUEST['region'];
        $horarios  = $_REQUEST['horarios'];
        $motivo    = $_REQUEST['motivo'];
        $fecha     = $_REQUEST['fecha'];
        $rut       = $_SESSION['rut'];

        $query     = $conn->prepare("INSERT INTO registros(nombre,mascota,idregion,idcomuna,fecha,idhora,idmotivo,rut) VALUES (?,?,?,?,?,?,?,?)");
        $query     ->bind_param("ssiisiis",$nombre,$mascota,$region,$comuna,$fecha,$horarios,$motivo,$rut);
        $success   = $query->execute();

        $response = ([
            "success" => $success,
            "mensaje" => $success ? "hora agendada correctamente":"error al agendar",
            "error"   => $query->error
        ]);
        echo json_encode($response);
        break;

    case 'obteneregistros':
        $query = "SELECT 
                registros.idregistro, 
                registros.nombre, 
                registros.mascota, 
                registros.fecha, 
                horas.descripcion AS descripcion_hora, 
                motivo.descripcionmotivo AS descripcion_motivo
                FROM registros
                INNER JOIN horas ON registros.idhora = horas.idhora
                INNER JOIN motivo ON registros.idmotivo = motivo.idmotivo";
        $result = $conn->query($query);
        if($result){
            $data = mysqli_fetch_all_assoc($result);
        }
        echo json_encode($data);
        break;

    case 'elimarregistro':
        $idregistro = $_REQUEST['idregistro'];
        $query      = $conn -> prepare("DELETE FROM registros  WHERE idregistro = ?");
        $query      -> bind_param("i",$idregistro);
        $success    = $query->execute();

        $response = ([
            "success"=> $success,
            "mensaje" => $success ? "registro eliminado correctamente" :"error al eliminar"
        ]);
        echo json_encode($response);
        break;
        
    case 'obtenerregistro':
        $idregistro = $_REQUEST['idregistro'];
        $query      = $conn -> prepare("SELECT 
                registros.idregistro, 
                registros.nombre, 
                registros.mascota, 
                registros.fecha,
                registros.idhora,
                registros.idmotivo,
                registros.idregion,
                registros.idcomuna,
                regiones.nombre AS nombre_region,
                comunas.nombre AS nombre_comuna,
                horas.descripcion AS descripcion_hora, 
                motivo.descripcionmotivo AS descripcion_motivo
                FROM registros
                INNER JOIN horas ON registros.idhora = horas.idhora
                INNER JOIN motivo ON registros.idmotivo = motivo.idmotivo
                INNER JOIN regiones ON registros.idregion = regiones.idregion
                INNER JOIN comunas ON registros.idcomuna = comunas.idcomuna
                WHERE registros.idregistro = ?");
        $query      -> bind_param("i",$idregistro);
        $query      -> execute();
        $result     = $query->get_result();
        if($result){
            $data = $result->fetch_assoc();
            echo json_encode($data);
        } 
        break;

        case 'editarregistros':
            $idregistro  = $_REQUEST['id'];
            $nombre      = $_REQUEST['nombre'];
            $mascota     = $_REQUEST['mascota'];
            $comuna      = $_REQUEST['comuna'];
            $region      = $_REQUEST['region'];
            $horarios    = $_REQUEST['horarios'];
            $motivo      = $_REQUEST['motivo'];
            $fecha       = $_REQUEST['fecha'];
            $query       =$conn -> prepare("UPDATE registros SET nombre = ?,mascota = ?,idregion = ?,idcomuna = ?,fecha = ?,idhora = ?, idmotivo = ? WHERE idregistro = ?");
            $query       ->bind_param("ssiisiii",$nombre,$mascota,$region,$comuna,$fecha,$horarios,$motivo,$idregistro);
            $success     = $query->execute();
            $response    = ([
                "success"=> $success,
                "mensaje" => $success ? "registro actualizado correctamente" :"error al actualizar"
            ]);
            echo json_encode($response);
        break;

        case 'validarhora':
            $idhora   = $_REQUEST['idhora'];
            $fecha    = $_REQUEST['fecha'];
            $query    = $conn->prepare("SELECT COUNT(*) AS total FROM registros WHERE fecha = ? AND idhora = ?");
            $query    ->bind_param("si",$fecha,$idhora);
            $query    ->execute();
            $result   = $query->get_result(); 
            $row     = $result->fetch_assoc();
            $ocupada = $row['total'] > 0;

            $response =([
                "success"=> $ocupada,
                "mensaje"=> $ocupada ? "hora ocupada":"hora disponible"
            ]);

            echo json_encode($response);
            break;
        
        case 'guardarUsuario':
            $nombreUser     = $_REQUEST['nombreUser'];
            $correoUser     = $_REQUEST['correoUser'];
            $rutUser        = $_REQUEST['rutUser'];
            $contrasenaUser = $_REQUEST['contrasenaUser'];
            $hashpassword   = password_hash($contrasenaUser,PASSWORD_DEFAULT);
            $query          = $conn->prepare("INSERT INTO usuarios(nombre,correo,rut,contrasena) VALUES (?,?,?,?)");
            $query          ->bind_param("ssss",$nombreUser,$correoUser,$rutUser,$hashpassword);
            $success        = $query->execute();
             if ($success) {
            // Intentar enviar correo
            $correoEnviado = enviarCorreoConfirmacion($correoUser, $nombreUser);
            $mensajeCorreo = $correoEnviado ? " y correo enviado." : ", pero no se pudo enviar el correo.";
            $response = [
                "success" => true,
                "mensaje" => "Registro realizado correctamente" . $mensajeCorreo
                ];
             } else {
            $response = [
                "success" => false,
                "mensaje" => "Error al registrar"
                ];
            }
            echo json_encode($response);
            break;
        
        case 'validarRut':
            $rutuser = $_REQUEST['rutUser'];
            $query   = $conn->prepare("SELECT COUNT(*) AS total FROM usuarios WHERE rut = ?");
            $query   ->bind_param("s",$rutuser);
            $query   ->execute();
            $result  = $query->get_result(); 
            $row     = $result->fetch_assoc();
            $existe  = $row["total"] > 0;

            $response =([
                "success"=> $existe,
                "mensaje"=> $existe ? "Rut ya existe":""
            ]);

            echo json_encode($response);
            break;

        case 'verificacionlogin':
            $correoUser  = $_REQUEST['correoUser'];
            $contraUser  = $_REQUEST['contrasenaUser'];
            $query       = $conn->prepare("SELECT id, nombre,contrasena, correo,rut FROM usuarios WHERE correo = ?");
            $query       -> bind_param("s",$correoUser);
            $query       -> execute();
            $result      = $query->get_result();

            if($result->num_rows === 1){
                $usuario = $result-> fetch_assoc();
               
                if(password_verify($contraUser,$usuario['contrasena'])){
                    
                    $response = ([
                        "success"   => true,
                        "mensaje"   => "Login Correcto",
                        "usuario"   =>[
                            "id"    => $usuario['id'],
                            "nombre"=> $usuario['nombre']
                        ]
                    ]);

                     $_SESSION["nombre"] = $usuario['nombre'];
                     $_SESSION["correo"] = $usuario['correo'];
                     $_SESSION["id"]     = $usuario['id'];
                     $_SESSION["rut"]    = $usuario["rut"];
                     $name   = $_SESSION["nombre"];
                     $correo = $_SESSION['correo'];
                     $id     = $_SESSION['id'];
                     $rut    = $_SESSION['rut'];
                    // echo "sesion iniciada para".$name.$correo.$id;
        
                } else{
                    $response = ([
                        "success" => false,
                        "mensaje" => "Contraseña incorrecta"
                    ]);
                }
            } else{
                $response = ([
                    "success" => false,
                    "mensaje" => "No existe ese usuario"
                ]);              
            }
            echo json_encode($response);
            break;

        case 'obtenerDatosLogin':
            if(isset($_SESSION['id'])){
                $response=([
                    "success"   => true,
                    "id"        => $_SESSION['id'],
                    "nombre"    => $_SESSION['nombre'],
                    "correo"    => $_SESSION['correo'],
                    "rut"       => $_SESSION['rut'],
                    "sesion_id" => session_id()
                ]);
            }else{
                $response = ([
                    "success" => false,
                ]);
            }

            echo json_encode($response);
            break;

        case 'cerrarSesion':
            $_SESSION = [];

             if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
                );
            }
            session_destroy();
            echo json_encode([
                "success" => true,
                "mensaje" => "Sesión cerrada correctamente"
            ]);
            break;

        case 'grillaUsuario':
            if(isset($_SESSION['id'])){

                $rut   = $_REQUEST['rut'];
                $query = $conn-> prepare("SELECT 
                            registros.idregistro, 
                            registros.nombre, 
                            registros.mascota,
                            regiones.nombre AS nombre_region,
                            comunas.nombre AS nombre_comuna, 
                            registros.fecha, 
                            horas.descripcion AS descripcion_hora, 
                            motivo.descripcionmotivo AS descripcion_motivo
                            FROM registros
                            INNER JOIN horas ON registros.idhora = horas.idhora
                            INNER JOIN motivo ON registros.idmotivo = motivo.idmotivo
                            INNER JOIN regiones ON registros.idregion = regiones.idregion
                            INNER JOIN comunas ON registros.idcomuna = comunas.idcomuna
                            WHERE rut = ?");
                $query  -> bind_param("s",$rut);
                $query  -> execute();
                $result = $query->get_result();
               if($result){
                 echo json_encode(mysqli_fetch_all_assoc($result));
               }
            }
            break;

        case 'verificarAgendamientos':
            if(!isset($_SESSION["rut"])){
                echo json_encode([
                    "success" => false,
                    "mensaje" => "Debe iniciar sesion para verificar agendamientos"
                ]);
                exit;
            } else{
                $rut = $_SESSION["rut"];
                $query = $conn->prepare("SELECT fecha FROM registros WHERE  rut = ? AND fecha >= CURDATE() ORDER BY fecha ASC");
                $query->bind_param("s",$rut);
                $query->execute();
                $result = $query->get_result();
                $agendamientos = $result->fetch_all(MYSQLI_ASSOC);
                $hoy = new DateTime();
                $hoy->modify('+1 day');
                $fechaManana = $hoy->format('Y-m-d');
                $tieneParaManana = false;
                foreach($agendamientos as $agendamiento){
                    if(trim($agendamiento['fecha']) == $fechaManana){
                        $tieneParaManana = true;
                        break;
                    }
                }
                if($tieneParaManana){
                    echo json_encode([
                        "success" => true,
                        "mensaje" => "Tiene agendamientos para mañana"
                    ]);
                }else{
                    echo json_encode([
                        "success" => false,
                        "mensaje" => "No tiene agendamientos para mañana"
                    ]);
                }
            }
        break;
            //necesito instanciar el dia de hoy y compararlo con la fecha de los agendamientos, si la fecha del agendamiento es mayor a la fecha de hoy por 1 dia, mandar  success a true, si no, mandar success a false
    default:
        # code...
        break;
}

?>