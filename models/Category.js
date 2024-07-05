const mongos = require("mongoose");

const CategorySchema = new mongos.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

const Category = mongos.model("category", CategorySchema);

module.exports = Category;
