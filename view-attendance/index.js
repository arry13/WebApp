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

    // Define the path to your Excel file
    const filePath = path.join(__dirname, 'Attendance.xlsx');
    const filePath1 = path.join(__dirname, 'Capacity.xlsx');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Excel file not found.' });
    }
    if (!fs.existsSync(filePath1)) {
        return res.status(404).json({ message: 'Excel file not found.' });
    }

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets['Attendance'];
    const workbook1 = xlsx.readFile(filePath1);
    const worksheet1 = workbook.Sheets['Capacity'];

    // Convert the worksheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);
    const data1 = xlsx.utils.sheet_to_json(worksheet1);
    // Filter data based on the selected month
    const filteredData = data.filter(row => row.Month === Month);
    const filteredData1 = data1.filter(row => row.Month === Month);
    // Return the filtered data as JSON
    res.json(filteredData);
    res.json(filteredData1);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
