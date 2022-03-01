const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Invalid username or email or password',
        });
      }

      const user = await Users.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ success: false, message: 'User already exists' });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ success: false, message: 'Password must be at least 6' });
      }

      // Hash password
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: hashPassword,
      });
      await newUser.save();
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
      });
      res.json({
        success: true,
        message: 'Register successfully',
        accesstoken: accesstoken,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid email or password' });
      }

      const user = await Users.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'Email already exists' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect Password' });
      }

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
      });
      res.json({
        success: true,
        message: 'Logged in successfully',
        accesstoken: accesstoken,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
      return res.json({ success: true, message: 'Logout successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res
          .status(400)
          .json({ success: false, message: 'Please Login or Register' });
      }

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res
            .status(400)
            .json({ success: false, message: 'Please Login or Register' });
        }
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ user, accesstoken });
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  history: async () => {
    try {
      const history = await Payments.find({ user_id: req.user.id });
      res.json(history);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'User does not exist.' });
      }

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );
      return res.json({ msg: 'Added to cart' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userCtrl;
