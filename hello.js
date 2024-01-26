// Import necessary modules
const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');
const MongoClient = require('mongodb').MongoClient;
const csv = require('csv-parser');
const { promisify } = require('util');

// Promisify file system functions
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Base URL for downloading files
const baseURL = 'https://www.bseindia.com/download/BhavCopy/Equity/EQ';

// Import custom modules
const uploadDataToMongoDB = require('./upload_to_mongo');
const createFolder = require('./createfolder');

// Create necessary folders if they don't exist
createFolder('download');
createFolder('converted');

// Function to generate a list of dates
function generateDates() {
    const startDate = new Date('12/23/2023');
    const excludedDates = [
        new Date('10/24/2023'),
        new Date('11/14/2023'),
        new Date('11/27/2023')
    ];

    const dates = [];
    let currentDate = startDate;

    while (dates.length < 50) {
        // Exclude Saturdays, Sundays, and specific dates
        if (
            currentDate.getDay() !== 0 && // Exclude Sundays
            currentDate.getDay() !== 6 && // Exclude Saturdays
            !excludedDates.some(excludedDate => currentDate.toDateString() === excludedDate.toDateString())
        ) {
            dates.push(new Date(currentDate));
        }

        // Move to the previous day
        currentDate.setDate(currentDate.getDate() - 1);
    }

    // Format the dates as strings without hyphens and with a two-digit year
    const formattedDates = dates.map(date => {
        const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
        const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
        return `${day}${month}${year}`;
    });

    return formattedDates;
}

// Function to extract files from a zip archive
async function extractFilesFromZip(zipFilePath, outputDirectory, date) {
    const zip = new AdmZip(zipFilePath);
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
        const entryPath = entry.entryName;
        const outputPath = `${outputDirectory}/${entryPath}`;

        const entryDirectory = outputPath.substring(0, outputPath.lastIndexOf('/'));
        if (!fs.existsSync(entryDirectory)) {
            await mkdirAsync(entryDirectory, { recursive: true });
        }

        await writeFileAsync(outputPath, entry.getData());
        console.log(`File extracted: ${outputPath}`);

        await uploadDataToMongoDB(outputPath, date);
    }

    console.log('Extraction completed.');
}

// Function to fetch data
async function fetchData() {
    try {
        const dateList = generateDates();

        // Iterate through each date
        for (const date of dateList) {
            const formattedDate = date.replace(/-/g, ''); // Remove hyphens from the date
            const url = `${baseURL}${formattedDate}_CSV.zip`;

            // Download zip file
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            // Save zip file to the root directory
            const fileName = `EQ${formattedDate}_CSV.zip`; // Naming convention assuming EQ + formatted date
            const filePath = `./download/${fileName}`; // Save to the root directory

            fs.writeFileSync(filePath, response.data);

            console.log(`File downloaded and saved: ${filePath}`);
            await extractFilesFromZip(filePath, "converted", date); // Await extraction
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Initiate data fetching process
fetchData();





