$(document).ready(function() {
    // Function to generate measurement fields for the selected department
    function generateMeasurementFields(department, valvesData) {
      $('#measurementFields').empty(); // Clear previous fields
  
      // Find the data for the selected department
      const selectedDepartmentData = valvesData.find((data) => data.department === department);
  
      // Generate fields for each valve (6 valves in total)
      for (let valve = 1; valve <= 6; valve++) {
        const valveData = selectedDepartmentData.valves.find((valveData) => valveData.valve_number === valve);
        let valveFieldsHtml = `
          <h4>Клапан полива № ${valve}</h4>
          <div class="form-group">
            <label for="date_${department}_${valve}">Дата измерений:</label>
            <input type="date" class="form-control" name="date_${department}_${valve}" value="${valveData.date}" required>
          </div>
          <div class="form-group">
            <label for="time_from_${department}_${valve}">Время замеров от:</label>
            <input type="time" class="form-control" name="time_from_${department}_${valve}" value="${valveData.time_from}" required>
          </div>
          <div class="form-group">
            <label for="time_to_${department}_${valve}">Время замеров до:</label>
            <input type="time" class="form-control" name="time_to_${department}_${valve}" value="${valveData.time_to}" required>
          </div>
          <div class="form-group">
            <label for="valve_number_${department}_${valve}">№ клапана полива:</label>
            <input type="text" class="form-control" name="valve_number_${department}_${valve}" value="${valve}" readonly required>
          </div>
          <div class="form-group">
            <label>Капельница:</label>
            <div class="form-row">
              <div class="col">
                <input type="text" class="form-control" name="dripper_volume_${department}_${valve}" placeholder="Объем" value="${valveData.dripper_volume}">
              </div>
              <div class="col">
                <input type="text" class="form-control" name="dripper_ec_${department}_${valve}" placeholder="EC" value="${valveData.dripper_ec}">
              </div>
              <div class="col">
                <input type="text" class="form-control" name="dripper_ph_${department}_${valve}" placeholder="pH" value="${valveData.dripper_ph}">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Дренаж:</label>
            <div class="form-row">
              <div class="col">
                <input type="text" class="form-control" name="drainage_volume_${department}_${valve}" placeholder="Объем" value="${valveData.drainage_volume}">
              </div>
              <div class="col">
                <input type="text" class="form-control" name="drainage_ec_${department}_${valve}" placeholder="EC" value="${valveData.drainage_ec}">
              </div>
              <div class="col">
                <input type="text" class="form-control" name="drainage_ph_${department}_${valve}" placeholder="pH" value="${valveData.drainage_ph}">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="mat_ec_${department}_${valve}">Материал EC:</label>
            <input type="text" class="form-control" name="mat_ec_${department}_${valve}" value="${valveData.mat_ec}" required>
          </div>
          <div class="form-group">
            <label for="mat_ph_${department}_${valve}">Материал pH:</label>
            <input type="text" class="form-control" name="mat_ph_${department}_${valve}" value="${valveData.mat_ph}" required>
          </div>
        `;
        $('#measurementFields').append(valveFieldsHtml);
      }
    }
  
    // Function to generate random data for a single valve
    function generateRandomData() {
      return {
        date: '2023-07-28',
        time_from: '08:00',
        time_to: '18:00',
        dripper_volume: (Math.random() * (20 - 5) + 5).toFixed(2),
        dripper_ec: (Math.random() * (12 - 8) + 8).toFixed(2),
        dripper_ph: (Math.random() * (9 - 5) + 5).toFixed(2),
        drainage_volume: (Math.random() * (8 - 2) + 2).toFixed(2),
        drainage_ec: (Math.random() * (10 - 6) + 6).toFixed(2),
        drainage_ph: (Math.random() * (8.5 - 5.5) + 5.5).toFixed(2),
        mat_ec: (Math.random() * (15 - 10) + 10).toFixed(2),
        mat_ph: (Math.random() * (9 - 5) + 5).toFixed(2),
      };
    }
  
    // Function to generate random data for all valves in a department
    function generateRandomDataForDepartment(department) {
      const departmentData = {
        department: department,
        valves: [],
      };
  
      for (let valve = 1; valve <= 6; valve++) {
        departmentData.valves.push({
          valve_number: valve,
          ...generateRandomData(),
        });
      }
  
      return departmentData;
    }
  
    // Array of four arrays, each representing a department with its valves data
    const departmentsData = [
      generateRandomDataForDepartment('1.1'),
      generateRandomDataForDepartment('1.2'),
      generateRandomDataForDepartment('1.4'),
      generateRandomDataForDepartment('1.5'),
    ];
  
    // Load default fields for department 1.1 on page load
    generateMeasurementFields('1.1', departmentsData);
  
    // Handle department selection change
    $('#department').on('change', function() {
      const selectedDepartment = $(this).val();
      generateMeasurementFields(selectedDepartment, departmentsData);
    });

    // Handle form submission
    $('#measurementForm').on('submit', function(e) {
        e.preventDefault();
        // Convert the form data to a JSON object
        const formDataObject = {};
        $(this).serializeArray().forEach(item => {
            formDataObject[item.name] = item.value;
        });
        
        // AJAX request to send data to the server
        $.ajax({
            type: 'POST',
            url: 'save.php',
            data: { data: JSON.stringify(formDataObject) }, // Wrap the JSON data in an object with a key 'data'
            contentType: 'application/json',
            dataType: 'json', // Expect JSON response from the server
            success: function(response) {
                // Handle the server response (optional)
                console.log('Data was successfully sent to the server.');
                console.log(response); // You can display a success message or handle the response here
            },
            error: function(error) {
                // Handle errors (optional)
                console.error('Error occurred while sending data to the server.');
                console.error(error); // You can display an error message or handle the error here
            }
        });
    });
  });