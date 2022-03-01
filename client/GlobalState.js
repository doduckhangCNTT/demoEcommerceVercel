// Store để các components có thể truy cập và lấy dữ liệu
import axios from 'axios';
import React, { Children, createContext, useEffect, useState } from 'react';
import ProductsAPI from './api/ProductsAPI';

export const GlobalState = createContext();

const DataProvider = ({ children }) => {
  const state = {
    productsAPI: ProductsAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};

export default DataProvider;
