const Category = require('../models/categoryModel');

const categoryCtrl = {
  getCategory: async (req, res) => {
    try {
      const categories = await Category.find();

      res.json(categories);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category) {
        return res
          .status(400)
          .json({ success: false, message: 'Category already exists' });
      }
      const newCategory = new Category({ name });
      await newCategory.save();
      res.json({ success: true, message: 'Created a Category ' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findByIdAndUpdate({ _id: req.params.id }, { name });
      res.json({ success: true, message: 'Updated a Category' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Deleted a category' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = categoryCtrl;
