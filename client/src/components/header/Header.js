import React, { useContext } from 'react';
import { GlobalState } from '../../GlobalState';
import Menu from './icon/menu.svg';
import Close from './icon/close.svg';
import Cart from './icon/cart.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const state = useContext(GlobalState);
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;

  const [cart] = state.userAPI.cart;

  // console.log(state);

  const logoutUser = async () => {
    await axios.get('/user/logout');
    localStorage.clear();
    window.location.href = '/';
    // setIsLogged(false);
    // setIsAdmin(false);
  };

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to='/create_product'>Create Product</Link>
        </li>
        <li>
          <Link to='/category'>Category</Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to='/history'>History</Link>
        </li>
        <li>
          <Link to='/' onClick={logoutUser}>
            Logout
          </Link>
        </li>
      </>
    );
  };

  return (
    <header>
      <div className='menu'>
        <img src={Menu} alt='' width='30' />
      </div>

      <div className='logo'>
        <h1>
          <Link to='/'>{isAdmin ? 'Admin' : 'Shoppee'}</Link>
        </h1>
      </div>

      <ul>
        <li>
          <Link to='/'>{isAdmin ? 'Products' : 'Shop'}</Link>
        </li>

        {isAdmin && adminRouter()}
        {/* Neu da login thi hien thi Logout */}
        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link to='/login'>Login ✥ Register</Link>
          </li>
        )}

        <li>
          <img src={Close} alt='' width='30' className='menu' />
        </li>
      </ul>

      {/* Neu la Admin thi ko hien thi cart */}
      {isAdmin ? (
        ''
      ) : (
        <div className='cart-icon'>
          <span>{cart.length}</span>
          <Link to='/cart'>
            <img src={Cart} alt='' width='30' />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
