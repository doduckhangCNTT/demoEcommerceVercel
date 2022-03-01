require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');
const upload = require('./routes/upload');
const productRouter = require('./routes/productRouter');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Router
app.use('/user', userRouter);
app.use('/api', categoryRouter);
app.use('/api', upload);
app.use('/api', productRouter);

// Connect DB
const URI = process.env.MONGODB_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongoodb connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
