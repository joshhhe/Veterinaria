<?php 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

function enviarCorreoConfirmacion($correoDestino, $nombreDestino) {
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'jose.chavez.saenz@gmail.com';        // Reemplaza con tu Gmail
        $mail->Password   = 'kzkq fdop ihdk cogo';    // Reemplaza con tu contraseña de app de Gmail
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Configuración del remitente y destinatario
        $mail->setFrom('jose.chavez.saenz@gmail.com', 'Veterinaria');
        $mail->addAddress($correoDestino, $nombreDestino);

        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = '¡Registro exitoso!';
        $mail->Body    = "
            <h3>Hola $nombreDestino,</h3>
            <p>Gracias por registrarte en nuestro sistema veterinario.</p>
            <p>Tu cuenta fue creada exitosamente.</p>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Error al enviar correo: {$mail->ErrorInfo}");
        return false;
    }
}

?>