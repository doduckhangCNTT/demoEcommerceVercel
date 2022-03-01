const Products = require('../models/productModel');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\bb(gte|gt|lte|lt|regex)\b/g,
      (match) => '$' + match
    );

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      console.log({ Sort: this.queryString.sort });
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createAt');
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    // Số lượng sản phẩm trên 1 trang
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    console.log(page, limit, skip);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      console.log(req.query);
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;
      res.json({
        status: 'success',
        results: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images) {
        return res
          .status(400)
          .json({ success: false, message: 'No images upload' });
      }
      // Kiem tra xem product da ton tai trong db hay chua
      const product = await Products.findOne({ product_id });
      if (product) {
        return res
          .status(400)
          .json({ success: false, message: 'Product already exists' });
      }

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });
      newProduct.save();

      res.json({
        success: true,
        message: 'Product saved successfully',
        newProduct: newProduct,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete({ _id: req.params.id });
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images) {
        return res
          .status(400)
          .json({ success: false, message: 'No images upload' });
      }

      await Products.findByIdAndUpdate(
        { _id: req.params.id },
        {
          product_id,
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ success: true, message: 'Updated a Product' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = productCtrl;
