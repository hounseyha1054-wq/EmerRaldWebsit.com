import { createContext, useContext, useState } from 'react';

export const CookieContext = createContext();
export const useCookies = () => useContext(CookieContext);

const CookieProvider = ({ children }) => {
  const [accepted, setAccepted] = useState(
    () => localStorage.getItem('eb_cookies') === 'accepted'
  );

  const accept = () => {
    localStorage.setItem('eb_cookies', 'accepted');
    setAccepted(true);
  };

  const decline = () => {
    localStorage.setItem('eb_cookies', 'declined');
    setAccepted(false);
  };

  const pending = localStorage.getItem('eb_cookies') === null;

  return (
    <CookieContext.Provider value={{ accepted, accept, decline, pending }}>
      {children}
    </CookieContext.Provider>
  );
};

export default CookieProvider;
