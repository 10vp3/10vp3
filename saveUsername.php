<?php
// Récupérer les données JSON envoyées
$data = json_decode(file_get_contents('php://input'), true);

$ip = $data['ip'];
$username = $data['username'];

// Lire le fichier JSON existant
$filename = 'ips.json';
$ips = json_decode(file_get_contents($filename), true);

// Ajouter le nouvel utilisateur à la liste
$ips['allowedIPs'][] = ['ip' => $ip, 'username' => $username];

// Sauvegarder le fichier JSON mis à jour
file_put_contents($filename, json_encode($ips, JSON_PRETTY_PRINT));

echo 'success';
?>
