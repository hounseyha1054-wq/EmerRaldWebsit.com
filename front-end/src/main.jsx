import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import MenuContextProvider from './context/Menucontext.jsx';
import AuthProvider from './context/AuthContext.jsx';
import CartProvider from './context/CartContext.jsx';
import CookieProvider from './context/CookieContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CookieProvider>
        <AuthProvider>
          <CartProvider>
            <MenuContextProvider>
              <App />
            </MenuContextProvider>
          </CartProvider>
        </AuthProvider>
      </CookieProvider>
    </BrowserRouter>
  </StrictMode>
);
