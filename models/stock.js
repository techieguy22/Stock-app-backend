// Import required modules
const mongoose = require('mongoose');

// Destructure Schema from mongoose
const { Schema } = mongoose;

// Define the schema for the stock data
const stockSchema = new mongoose.Schema({
  // Define SC_CODE field with type Number and required constraint
  SC_CODE: { type: Number, required: true },
  // Define SC_NAME field with type String and required constraint
  SC_NAME: { type: String, required: true },
  // Define SC_GROUP field with type String
  SC_GROUP: String,
  // Define SC_TYPE field with type String
  SC_TYPE: String,
  // Define OPEN field with type Number and required constraint
  OPEN: { type: Number, required: true },
  // Define HIGH field with type Number and required constraint
  HIGH: { type: Number, required: true },
  // Define LOW field with type Number and required constraint
  LOW: { type: Number, required: true },
  // Define CLOSE field with type Number and required constraint
  CLOSE: { type: Number, required: true },
  // Define LAST field with type Number
  LAST: Number,
  // Define PREVCLOSE field with type Number
  PREVCLOSE: Number,
  // Define NO_TRADES field with type Number
  NO_TRADES: Number,
  // Define NO_OF_SHRS field with type Number
  NO_OF_SHRS: Number,
  // Define NET_TURNOV field with type Number
  NET_TURNOV: Number,
  // Define TDCLOINDI field with type String
  TDCLOINDI: String,
  // Define favorite field with type Boolean and default value of false
  favorite: { type: Boolean, default: false },
  // Define DATE field with type Date and required constraint
  DATE: { type: Date, required: true }
});

// Create and export the Stock model based on the defined schema
module.exports = mongoose.model('Stock', stockSchema);





