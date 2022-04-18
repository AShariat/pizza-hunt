// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them.
const { Schema, model } = require("mongoose");

const PizzaSchema = new Schema({
  pizzaName: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  // For the timestamp field, createdAt, we set a default value to the JavaScript Date.now function. If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp. This way we don't have to create the timestamp elsewhere and send that data.
  createdAt: {
    type: Date,
    default: Date.now,
  },
  size: {
    type: String,
    default: "Large",
  },
  // The empty brackets [] in the toppings field. This indicates an array as the data type. You could also specify Array in place of the brackets.
  toppings: [],
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
