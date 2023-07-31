<?php
// Assuming your data is sent as JSON
$data = json_decode($_POST['data'], true);

$file = fopen("log.txt", "w");
fwrite($file, "Данные успешно получены");
fclose($file);

// Connect to your database (replace 'your_host', 'your_username', 'your_password', and 'your_database' with the correct values)
$host = '127.0.0.1';
$username = 'root';
$password = '';
$database = 'test_task_form';

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare the INSERT statement
    $stmt = $conn->prepare("INSERT INTO measurements (department, valve, date, time_from, time_to, valve_number, dripper_volume, dripper_ec, dripper_ph, drainage_volume, drainage_ec, drainage_ph, mat_ec, mat_ph, measurement_by) 
                           VALUES (:department, :valve, :date, :time_from, :time_to, :valve_number, :dripper_volume, :dripper_ec, :dripper_ph, :drainage_volume, :drainage_ec, :drainage_ph, :mat_ec, :mat_ph, :measurement_by)");

    // Bind parameters and execute the statement for each row of data
    foreach ($data as $valveData) {
        $stmt->bindParam(':department', $valveData['department']);
        $stmt->bindParam(':valve', $valveData['valve']);
        $stmt->bindParam(':date', $valveData['date']);
        $stmt->bindParam(':time_from', $valveData['time_from']);
        $stmt->bindParam(':time_to', $valveData['time_to']);
        $stmt->bindParam(':valve_number', $valveData['valve_number']);
        $stmt->bindParam(':dripper_volume', $valveData['dripper_volume']);
        $stmt->bindParam(':dripper_ec', $valveData['dripper_ec']);
        $stmt->bindParam(':dripper_ph', $valveData['dripper_ph']);
        $stmt->bindParam(':drainage_volume', $valveData['drainage_volume']);
        $stmt->bindParam(':drainage_ec', $valveData['drainage_ec']);
        $stmt->bindParam(':drainage_ph', $valveData['drainage_ph']);
        $stmt->bindParam(':mat_ec', $valveData['mat_ec']);
        $stmt->bindParam(':mat_ph', $valveData['mat_ph']);
        $stmt->bindParam(':measurement_by', $valveData['measurement_by']);

        $stmt->execute();
    }

    echo json_encode(['success' => true]); // Send JSON response indicating success
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]); // Send JSON response with error message
}
?>