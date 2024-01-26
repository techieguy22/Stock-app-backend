// Import required modules
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

// Define CSV file path
const csvFilePath = 'C:/Users/ABHIJEET/OneDrive/Desktop/hypergro/downloads/EQ200122.CSV';

// MongoDB configuration
const dbName = 'backend_data';
const collectionName = 'backend_col';
const url = 'mongodb+srv://alphacoder221:mongopass@cluster0.l0tr0qe.mongodb.net/backend_data?retryWrites=true&w=majority';

// Define the schema for the stock data
const stockSchema = new mongoose.Schema({
  SC_CODE: { type: Number, required: true },
  SC_NAME: { type: String, required: true },
  SC_GROUP: String,
  SC_TYPE: String,
  OPEN: { type: Number, required: true },
  HIGH: { type: Number, required: true },
  LOW: { type: Number, required: true },
  CLOSE: { type: Number, required: true },
  LAST: Number,
  PREVCLOSE: Number,
  NO_TRADES: Number,
  NO_OF_SHRS: Number,
  NET_TURNOV: Number,
  TDCLOINDI: String,
  favorite: { type: Boolean, default: false },
  DATE: { type: Date, required: true }
});

// Create a model based on the schema
const Stock = mongoose.model('Stock', stockSchema);

// Function to upload CSV data to MongoDB
const uploadDataToMongoDB = async (csvFilePath, date) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Array to store parsed rows from CSV
    const rows = [];

    // Read the CSV file and parse its data
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Parse each row and create a stock data object
        const stockData = {
          SC_CODE: parseInt(row.SC_CODE),
          SC_NAME: row.SC_NAME.trim(),
          SC_GROUP: row.SC_GROUP.trim(),
          SC_TYPE: row.SC_TYPE.trim(),
          OPEN: parseFloat(row.OPEN),
          HIGH: parseFloat(row.HIGH),
          LOW: parseFloat(row.LOW),
          CLOSE: parseFloat(row.CLOSE),
          LAST: parseFloat(row.LAST),
          PREVCLOSE: parseFloat(row.PREVCLOSE),
          NO_TRADES: parseInt(row.NO_TRADES),
          NO_OF_SHRS: parseInt(row.NO_OF_SHRS),
          NET_TURNOV: parseFloat(row.NET_TURNOV),
          TDCLOINDI: row.TDCLOINDI.trim(),
          DATE: date
        };

        // Push the stock data object to the array
        rows.push(stockData);
      })
      .on('end', async () => {
        // If there are rows in the array, insert them into MongoDB
        if (rows.length > 0) {
          await Stock.insertMany(rows);
          console.log('CSV file successfully processed and data uploaded to MongoDB');
        }
      });
  } finally {
    // Close the MongoDB connection
    console.log('Connection to the database closed');
  }
};

// Export the function for external use
module.exports = uploadDataToMongoDB;







