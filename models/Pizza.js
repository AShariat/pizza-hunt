// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them.
const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
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
      // With this get option in place, every time we retrieve a pizza, the value in the createdAt field will be formatted by the dateFormat() function and used instead of the default timestamp value. This way, we can use the timestamp value for storage, but use a prettier version of it for display.
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: "Large",
    },
    // The empty brackets [] in the toppings field. This indicates an array as the data type. You could also specify Array in place of the brackets.
    toppings: [],
    // We need to tell Mongoose to expect an ObjectId and to tell it that its data comes from the Comment model.
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  // We need to tell the schema that it can use virtuals and getters.
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// get total count of comments and replies on retrieval. Here we're using the .reduce() method to tally up the total of every comment with its replies. In its basic form, .reduce() takes two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the currentValue is comment. As .reduce() walks through the array, it passes the accumulating total and the current value of comment into the function, with the return of the function revising the total for the next iteration through the array. Like .map(), the array prototype method .reduce() executes a function on each element in an array. However, unlike .map(), it uses the result of each function execution for each successive computation as it goes through the array. This makes it a perfect candidate for getting a sum of multiple values.
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
