const { Pizza } = require("../models");

const pizzaController = {
  // the functions will go in here as methods
  // get all pizzas
  // The first method, getAllPizza(), will serve as the callback function for the GET /api/pizzas route. It uses the Mongoose .find() method, much like the Sequelize .findAll() method.
  getAllPizza(req, res) {
    Pizza.find({})
      // In SQL we joined two tables to resolve the problem, but in MongoDB we'll populate a field. To populate a field, just chain the .populate() method onto your query, passing in an object with the key path plus the value of the field you want populated.
      .populate({
        path: "comments",
        // We also used the select option inside of populate(), so that we can tell Mongoose that we don't care about the __v field on comments either. The minus sign - in front of the field indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field.
        select: "-__v",
      })
      // Since we're doing that for our populated comments, let's update the query to not include the pizza's __v field either, as it just adds more noise to our returning data.
      .select("-__v")
      // This gets the newest pizza because a timestamp value is hidden somewhere inside the MongoDB ObjectId.
      .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  // The second method, .getPizzaById(), uses the Mongoose .findOne() method to find a single pizza by its _id. Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled.
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createPizza
  // With this .createPizza() method, we destructure the body out of the Express.js req object because we don't need to interface with any of the other data it provides. Again, just like with Sequelize, in Mongoose we use the method .create() to create data. In MongoDB, the methods for adding data to a collection are .insertOne() or .insertMany(). But in Mongoose, we use the .create() method, which will actually handle either one or multiple inserts!
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.status(400).json(err));
  },

  // update pizza by id
  // With this .findOneAndUpdate() method, Mongoose finds a single document we want to update, then updates it and returns the updated document. If we don't set that third parameter, { new: true }, it will return the original document. By setting the parameter to true, we're instructing Mongoose to return the new version of the document. There are also Mongoose and MongoDB methods called .updateOne() and .updateMany(), which update documents without returning them.
  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      // Mongoose only executes the validators automatically when we actually create new data. This means that a user can create a pizza, but then update that pizza with totally different data and not have it validated. Let's go ahead and fix that with a simple option setting.
      runValidators: true,
    })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete pizza
  // In this example, we use the Mongoose .findOneAndDelete() method, which will find the document to be returned and also delete it from the database. Like with updating, we could alternatively use .deleteOne() or .deleteMany(), but we're using the .findOneAndDelete() method because it provides a little more data in case the client wants it.
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
