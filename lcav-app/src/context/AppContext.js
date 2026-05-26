import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, saveToken, clearToken } from '../api';

const AppContext = createContext();

export const GROUPS = ['U10', 'U12', 'U14', 'U16', 'U18', 'U20', 'Aktive', 'Masters'];

export const DISCIPLINES = {
  'Laufen': ['60m', '100m', '200m', '400m', '800m', '1500m', '3000m', '5000m', '10000m', 'Marathon', '60m Hürden', '100m Hürden', '110m Hürden', '400m Hürden', '3000m Hindernislauf', '4×100m Staffel', '4×400m Staffel'],
  'Sprung': ['Hochsprung', 'Stabhochsprung', 'Weitsprung', 'Dreisprung'],
  'Wurf':   ['Kugelstoß', 'Diskuswurf', 'Hammerwurf', 'Speerwurf', 'Gewichtwurf'],
  'Mehrkampf': ['Zehnkampf', 'Siebenkampf', 'Fünfkampf (Halle)', 'Kinderzehnkampf'],
  'Cross / Straße': ['Crosslauf', 'Straßenlauf', 'Berglauf', 'Nordic Walking'],
};

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage]   = useState('dashboard');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lcav_token');
    if (token) {
      api.me()
        .then(user => setCurrentUser(user))
        .catch(() => clearToken())
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { token, user } = await api.login(email, password);
    saveToken(token);
    setCurrentUser(user);
    setActivePage('dashboard');
  };

  const logout = () => {
    clearToken();
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, activePage, setActivePage, login, logout, authLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
