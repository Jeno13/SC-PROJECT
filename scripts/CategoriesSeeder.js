/**
 * Categories Seeder
 * This file used one time only to seed categories to database
 * Check if categories list is exists
 * loop on each category and check on database if category not exists on database insert it
 */

const categories = require("../data/categories.js");
const Category = require("../models/Category.js");

const SeedCategoriesData = async () => {
  if (categories.length) {
    try {
      categories.map(async (categoryObject) => {
        const isExist = await Category.findOne({
          name: categoryObject.name,
        }).count();
        if (!isExist) {
          await Category.create(categoryObject).then(() => {
            console.log(
              `Category ${categoryObject.name} has been inserted to database successfully`
            );
          });
        }
      });
    } catch (err) {
      console.log("Error seeding categories list");
    }
  }
};

module.exports = SeedCategoriesData;
