// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Stock = require('./models/stock'); // Assuming stock model is defined in 'models/stock.js'

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB connection URL
const url = "mongodb+srv://alphacoder221:mongopass@cluster0.l0tr0qe.mongodb.net/23_old?retryWrites=true&w=majority";

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Route to get top 10 stocks
app.get("/top-stocks", async (req, res) => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const topStocks = await Stock.find().sort({ CLOSE: -1 }).limit(10);
    res.json(topStocks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route to find stocks by name
app.get("/stocks/:name", async (req, res) => {
  try {
    const stockName = req.params.name;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const foundStocks = await Stock.find({ SC_NAME: new RegExp(stockName, "i") });
    res.json(foundStocks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  } finally {
    mongoose.connection.close();
    console.log("Connection to the database closed");
  }
});

// Route to get stock history of a particular stock for the last 50 days
app.get('/stock-history/:id', async (req, res) => {
  try {
    const stockCode = req.params.id;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const stockHistory = await Stock.find({ SC_CODE: stockCode });
    if (!stockHistory || stockHistory.length === 0) {
      return res.status(404).json({ message: 'Stock history not found for provided SC_CODE' });
    }
    res.json(stockHistory);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  } finally {
    mongoose.connection.close();
    console.log("Connection to the database closed");
  }
});

// Route to add a given stock to favorites
app.post("/add-favorites/:name", async (req, res) => {
  try {
    const stockName = req.params.name;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const foundStock = await Stock.findOneAndUpdate(
      { SC_NAME: new RegExp(stockName, "i") },
      { $set: { favorite: true } },
      { new: true }
    );
    if (!foundStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.json({ message: "Stock marked as favorite", stock: foundStock });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  } finally {
    mongoose.connection.close();
    console.log("Connection to the database closed");
  }
});

// Route to see favorite stocks
app.get("/favorites", async (req, res) => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const favoriteStocks = await Stock.find({ favorite: true });
    res.json({ favoriteStocks });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  } finally {
    mongoose.connection.close();
    console.log("Connection to the database closed");
  }
});

// Route to remove a stock from favorites
app.delete("/delete-favorites/:name", async (req, res) => {
  try {
    const stockName = req.params.name;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const foundStock = await Stock.findOneAndUpdate(
      { SC_NAME: new RegExp(stockName, "i") },
      { $set: { favorite: false } },
      { new: true }
    );
    if (!foundStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.json({ message: "Stock removed from favorites", stock: foundStock });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  } finally {
    mongoose.connection.close();
    console.log("Connection to the database closed");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});









