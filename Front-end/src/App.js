import { useContext, useState } from "react";
import Container from '@mui/material/Container';
import LoginPage from './pages/login';
import Main from './pages/main';
import AppProvider from './context/AppProvider';
import './App.css';

function App() {
  const isLogin = false;
  return (
    <AppProvider>
        {
          isLogin
            ?
            <Main />
            :
            <div className='main'>
              <h1>
                Github project searching tool
              </h1>
              <div className="phone_field">
                <LoginPage />
              </div>
            </div>
        }
    </AppProvider>
  );
}

export default App;
