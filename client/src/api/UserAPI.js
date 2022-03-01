import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [history, setHistory] = useState([]);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          // Cung cap token vào Header
          const res = await axios.get('/user/info', {
            headers: { Authorization: token },
          });
          // Hien thi toàn bộ thông tin mà người dùng Login
          // console.log(res);

          // Kiem tra da Login
          setIsLogged(true);
          // Kiem tra co phai la Admin
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(res.data.cart);
        } catch (error) {
          alert(error.message);
        }
      };

      getUser();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        const res = await axios.get('/user/history', {
          headers: { Authorization: token },
        });
        setHistory(res.data);
      };
      getHistory();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged) {
      return alert('Please login to continue buying');
    }
    // Kiểm tra xem tất cả các product trong cart đã tồn tại cái product được thêm hay chưa
    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        '/user/addCart',
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
  };
};

export default UserAPI;
