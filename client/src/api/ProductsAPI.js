import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ProductsAPI = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const res = await axios.get('/api/products');
    // console.log(res.data.products);
    setProducts(res.data.products);
  };

  // Vì làm việc với api lên khi gọi hàm thực thi api thì để vào useEffect để chỉ gọi hàm đó 1 lần duy nhất
  useEffect(() => {
    getProducts();
  }, []);

  return {
    products: [products, setProducts],
  };
};

export default ProductsAPI;
