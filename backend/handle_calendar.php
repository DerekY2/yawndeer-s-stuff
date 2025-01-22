<?php
  include 'dependencies';

  $conn = new mysqli("Host IP", "User", "Auth", "Database"); // placeholder values for public release

  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }

  $data = json_decode(file_get_contents('php://input'), true);
  $name = $data['name'];
  $date = $data['time'];
  $school = $data['institution'];
  $term = $data['term'];
  $info = $data['info'];
  $calendar = $data['calendar'];

  if($school=='carleton'){
    $stmt = $conn->prepare("INSERT INTO carleton(date, user, term, events, calendar_data) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $date, $name, $term, $info, $calendar);
  }

  $stmt->execute();

  $stmt->close();
  $conn->close();
?>