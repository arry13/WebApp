const express = require('express');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch data based on the selected month
app.get('/fetch-data', (req, res) => {
    const { Month } = req.query;

    // Define paths to your Excel files
    const filePathAttendance = path.join(__dirname, 'Attendance.xlsx');
    const filePathCapacity = path.join(__dirname, 'Capacity.xlsx');

    // Check if files exist
    if (!fs.existsSync(filePathAttendance) || !fs.existsSync(filePathCapacity)) {
        return res.status(404).json({ message: 'One or both Excel files not found.' });
    }

    // Read and parse Attendance.xlsx
    const workbookAttendance = xlsx.readFile(filePathAttendance);
    const worksheetAttendance = workbookAttendance.Sheets['Attendance'];
    const attendanceData = xlsx.utils.sheet_to_json(worksheetAttendance);

    // Read and parse Capacity.xlsx
    const workbookCapacity = xlsx.readFile(filePathCapacity);
    const worksheetCapacity = workbookCapacity.Sheets['Capacity'];
    const capacityData = xlsx.utils.sheet_to_json(worksheetCapacity);

    // Filter data by month
    const filteredAttendance = attendanceData.filter(row => row.Month === Month);
    const filteredCapacity = capacityData.filter(row => row.Month === Month);

    // Send combined data in one response
    res.json({
        attendance: filteredAttendance,
        capacity: filteredCapacity
    });
});

app.get('/fetch-capacity-efforts', (req, res) => {
    console.log("Fetching capacity and efforts..."); 
    const { Month } = req.query; 

    const filePathCapacity = path.join(__dirname, 'Capacity.xlsx');

    // Check if file exists
    if (!fs.existsSync(filePathCapacity)) {
        return res.status(404).json({ message: 'Capacity Excel file not found.' });
    }

    // Read and parse Capacity.xlsx
    const workbookCapacity = xlsx.readFile(filePathCapacity);
    const worksheetCapacity = workbookCapacity.Sheets['Capacity'];
    const capacityData = xlsx.utils.sheet_to_json(worksheetCapacity);

    // Filter data by month if applicable 
    const filteredCapacity = capacityData.filter(row => row.Month === Month);

    // If no data found for the given month, return an error
    if (filteredCapacity.length === 0) {
        return res.status(404).json({ message: 'No data found for the selected month.' });
    }

    // Extract efforts and capacity from the filtered data
    const { capacity, efforts } = filteredCapacity[0];

    // Send efforts and capacity
    res.json({
        capacity,
        efforts
    });
});




// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
