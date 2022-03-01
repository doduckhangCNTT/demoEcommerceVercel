const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const Products = require('../models/productModel');

const paymentCtrl = {
  getPayment: async () => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('name email');
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'User not found' });
      }
      const { cart, paymentID, address } = req.body;

      const { _id, name, email } = user;

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,
      });
      // Khi user thanh toán thì lấy số của sản phẩm và cập nhật lại số lượng sản  phẩm đã bán
      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });

      // console.log(newPayment);
      await newPayment.save();
      res.json({ message: 'Payment Success' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

const sold = async (id, quantity, oldSold) => {
  await Products.findOneAndUpdate({ _id: id }, { sold: quantity + oldSold });
};

module.exports = paymentCtrl;
