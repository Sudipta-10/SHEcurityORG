<?php
require 'vendor/autoload.php'; 

use Twilio\Rest\Client;

$data = json_decode(file_get_contents("php://input"));

$account_sid = 'YOUR_TWILIO_ACCOUNT_SID';
$auth_token = 'YOUR_TWILIO_AUTH_TOKEN';
$twilio_number = 'YOUR_TWILIO_PHONE_NUMBER';

$client = new Client($account_sid, $auth_token);
$client->messages->create(
    $data->mobile,
    [
        'from' => $twilio_number,
        'body' => $data->message
    ]
);

echo json_encode(["status" => "SMS sent"]);
?>
